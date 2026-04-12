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
    deliberation_id,
    interview_type,
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
  const type = interview_type || "deliberation";

  // Save interview
  const { data: interview, error: interviewError } = await supabase
    .from("interviews")
    .insert({
      deliberation_id,
      session_id: sessionId,
      interview_type: type,
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

  // Extract structured data: prefer toolCallData, fall back to regex on last assistant message
  const lastAssistant = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "assistant");

  const tcd: ToolCallData | undefined = toolCallData;

  if (type === "survey") {
    return handleSurveyResponse(
      supabase,
      interview,
      lastAssistant,
      sessionId,
      canton,
      occupation,
      tcd
    );
  }

  return handleDeliberationResponse(
    supabase,
    req,
    interview,
    lastAssistant,
    sessionId,
    deliberation_id,
    tcd
  );
}

async function handleDeliberationResponse(
  supabase: ReturnType<typeof createServiceClient>,
  req: Request,
  interview: { id: string },
  lastAssistant: { content: string } | undefined,
  sessionId: string,
  deliberation_id: string,
  tcd?: ToolCallData
) {
  // Prefer tool call data, fall back to regex
  let opinionText = tcd?.opinion;

  if (!opinionText) {
    const opinionMatch = lastAssistant?.content?.match(
      /```OPINION\s*\n([\s\S]*?)\n```/
    );
    opinionText = opinionMatch?.[1]?.trim();
  }

  if (!opinionText) {
    return NextResponse.json({
      interview_id: interview.id,
      opinion_saved: false,
    });
  }

  // Generate embedding for the opinion
  let embedding: number[] | null = null;
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: opinionText,
    });
    embedding = embeddingRes.data[0].embedding;
  } catch (err) {
    console.error("Embedding error:", err);
  }

  // Save opinion
  const { error: opinionError } = await supabase.from("opinions").insert({
    deliberation_id,
    interview_id: interview.id,
    session_id: sessionId,
    opinion_text: opinionText,
    embedding,
  });

  if (opinionError) {
    console.error("Opinion save error:", opinionError);
  }

  // Check if we should trigger consensus generation
  const { count } = await supabase
    .from("opinions")
    .select("*", { count: "exact", head: true })
    .eq("deliberation_id", deliberation_id);

  const { data: deliberation } = await supabase
    .from("deliberations")
    .select("min_opinions_for_consensus")
    .eq("id", deliberation_id)
    .single();

  const threshold = deliberation?.min_opinions_for_consensus ?? 5;
  const shouldGenerateConsensus =
    count !== null && count >= threshold && count % 5 === 0;

  if (shouldGenerateConsensus) {
    fetch(new URL("/api/dialogue/consensus/generate", req.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliberation_id }),
    }).catch(() => {});
  }

  return NextResponse.json({
    interview_id: interview.id,
    opinion_saved: !opinionError,
  });
}

async function handleSurveyResponse(
  supabase: ReturnType<typeof createServiceClient>,
  interview: { id: string },
  lastAssistant: { content: string } | undefined,
  sessionId: string,
  canton: string | null,
  occupation: string | null,
  tcd?: ToolCallData
) {
  // Prefer tool call data, fall back to regex
  let themes: unknown = [];
  let overallSentiment: unknown = null;
  let opinionText: string | undefined = tcd?.opinion;

  if (tcd?.surveyResponse) {
    const sr = tcd.surveyResponse as { themes?: unknown; overallSentiment?: unknown };
    themes = sr.themes || [];
    overallSentiment = sr.overallSentiment || null;
  } else {
    // Regex fallback
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

  // Generate embedding from the opinion text if available
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

  // Save survey response
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
