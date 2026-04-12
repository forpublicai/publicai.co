import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";

export async function GET() {
  const supabase = createServiceClient();

  // Fetch suggestions with vote counts
  const { data: suggestions, error } = await supabase
    .from("question_suggestions")
    .select("id, question_text, source, session_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Suggestions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  // Fetch vote counts per suggestion
  const { data: votes } = await supabase
    .from("question_votes")
    .select("suggestion_id, vote");

  const voteCounts = new Map<string, number>();
  for (const v of votes || []) {
    voteCounts.set(
      v.suggestion_id,
      (voteCounts.get(v.suggestion_id) || 0) + v.vote
    );
  }

  // Get current session to mark which ones the user voted for
  let sessionId: string | null = null;
  try {
    sessionId = await getSessionId();
  } catch {
    // no session — that's fine for a GET
  }

  const votedSet = new Set<string>();
  if (sessionId) {
    const { data: myVotes } = await supabase
      .from("question_votes")
      .select("suggestion_id")
      .eq("session_id", sessionId);
    for (const v of myVotes || []) {
      votedSet.add(v.suggestion_id);
    }
  }

  const enriched = (suggestions || [])
    .map((s) => ({
      id: s.id,
      questionText: s.question_text,
      source: s.source,
      votes: voteCounts.get(s.id) || 0,
      hasVoted: votedSet.has(s.id),
      createdAt: s.created_at,
    }))
    .sort((a, b) => b.votes - a.votes);

  return NextResponse.json({ suggestions: enriched });
}

export async function POST(req: Request) {
  let sessionId: string;
  try {
    sessionId = await getSessionId();
  } catch {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const { questionText } = await req.json();

  if (!questionText || typeof questionText !== "string" || questionText.trim().length < 10) {
    return NextResponse.json(
      { error: "Question must be at least 10 characters" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("question_suggestions")
    .insert({
      session_id: sessionId,
      question_text: questionText.trim(),
      source: "user",
    })
    .select()
    .single();

  if (error) {
    console.error("Suggestion insert error:", error);
    return NextResponse.json(
      { error: "Failed to save suggestion" },
      { status: 500 }
    );
  }

  return NextResponse.json({ suggestion: data });
}
