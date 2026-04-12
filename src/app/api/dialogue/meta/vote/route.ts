import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";

export async function POST(req: Request) {
  let sessionId: string;
  try {
    sessionId = await getSessionId();
  } catch {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const { suggestionId } = await req.json();

  if (!suggestionId) {
    return NextResponse.json(
      { error: "Missing suggestionId" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Upsert — one vote per session per suggestion
  const { error } = await supabase.from("question_votes").upsert(
    {
      suggestion_id: suggestionId,
      session_id: sessionId,
      vote: 1,
    },
    { onConflict: "suggestion_id,session_id" }
  );

  if (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
