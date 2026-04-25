import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import OpenAI from "openai";

export const maxDuration = 60;

const openai = new OpenAI();

interface ToolCallData {
  opinion?: string;
  analysis?: Record<string, unknown>;
  surveyResponse?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const {
    messages,
    canton,
    age_range,
    occupation,
    language,
    toolCallData,
  } = await req.json();

  let sessionId: string;
  try {
    sessionId = await getSessionId();
  } catch {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: interview, error: interviewError } = await supabase
    .from("interviews")
    .insert({
      deliberation_id: null,
      session_id: sessionId,
      interview_type: "survey",
      messages,
      language: language || "en",
      canton: canton || null,
      age_range: age_range || null,
      occupation: occupation || null,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (interviewError || !interview) {
    console.error("Interview save error:", interviewError);
    return NextResponse.json(
      { error: "Failed to save interview" },
      { status: 500 }
    );
  }

  const lastAssistant = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "assistant");

  const tcd: ToolCallData | undefined = toolCallData;

  let themes: unknown = [];
  let overallSentiment: unknown = null;
  let opinionText: string | undefined = tcd?.opinion;

  if (tcd?.surveyResponse) {
    const sr = tcd.surveyResponse as { themes?: unknown; overallSentiment?: unknown };
    themes = sr.themes || [];
    overallSentiment = sr.overallSentiment || null;
  } else {
    const surveyMatch = lastAssistant?.content?.match(
      /```SURVEY_RESPONSE\s*\n([\s\S]*?)\n```/
    );
    if (surveyMatch) {
      try {
        const parsed = JSON.parse(surveyMatch[1]);
        themes = parsed.themes || [];
        overallSentiment = parsed.overallSentiment || null;
      } catch {
        // ignore parse errors
      }
    }
  }

  if (!opinionText) {
    const opinionMatch = lastAssistant?.content?.match(
      /```OPINION\s*\n([\s\S]*?)\n```/
    );
    opinionText = opinionMatch?.[1]?.trim();
  }

  let embedding: number[] | null = null;
  if (opinionText) {
    try {
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: opinionText,
      });
      embedding = embeddingRes.data[0].embedding;
    } catch (err) {
      console.error("Embedding error:", err);
    }
  }

  const { error: surveyError } = await supabase
    .from("survey_responses")
    .insert({
      interview_id: interview.id,
      session_id: sessionId,
      themes,
      overall_sentiment: overallSentiment,
      canton: canton || null,
      occupation: occupation || null,
      opinion_text: opinionText || null,
      embedding,
    });

  if (surveyError) {
    console.error("Survey response save error:", surveyError);
  }

  return NextResponse.json({
    interview_id: interview.id,
    survey_saved: !surveyError,
  });
}
