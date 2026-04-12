import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, zodSchema } from "ai";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";
import { headers } from "next/headers";
import { cityToCanton, getLanguageName } from "@/lib/languages";
import { getCantonById } from "@/components/dialogue/CantonMap";

export const maxDuration = 60;

const promptDir = join(process.cwd(), "src/app/api/dialogue");

function loadPrompt(interviewType: string): string {
  const filename =
    interviewType === "survey"
      ? "interview_prompt_survey.md"
      : "interview_prompt_deliberation.md";
  return readFileSync(join(promptDir, filename), "utf-8");
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const surveyTools = {
  complete_survey: tool({
    description:
      "Call this tool when the interview is complete and the participant has confirmed your summary. Captures the opinion, analysis, and structured survey response.",
    inputSchema: zodSchema(
      z.object({
        opinion: z
          .string()
          .describe(
            "A concise 1-3 sentence statement capturing the participant's core position on Swiss public AI"
          ),
        analysis: z.object({
          summary: z
            .string()
            .describe(
              "2-3 sentence narrative of the participant's key positions and values"
            ),
          topThemes: z.array(z.string()).describe("Top 3 themes from the conversation"),
          topicScores: z.array(
            z.object({
              topic: z.string(),
              userPosition: z.string().describe("Brief stance label"),
              alignmentWithMajority: z
                .number()
                .min(0)
                .max(100)
                .describe("0-100 estimate of alignment with typical Swiss opinion"),
            })
          ),
        }),
        surveyResponse: z.object({
          themes: z.array(
            z.object({
              theme: z.string(),
              position: z.string().describe("Summary of their stance"),
              sentiment: z
                .enum(["positive", "mixed", "negative"])
                .describe("Sentiment on this theme"),
            })
          ),
          overallSentiment: z.object({
            hope: z.number().min(0).max(1),
            concern: z.number().min(0).max(1),
          }),
        }),
      })
    ),
  }),
};

const deliberationTools = {
  complete_deliberation: tool({
    description:
      "Call this tool when the interview is complete and the participant has confirmed your summary. Captures the opinion and analysis.",
    inputSchema: zodSchema(
      z.object({
        opinion: z
          .string()
          .describe(
            "A concise 1-3 sentence statement capturing the participant's core position on the deliberation question"
          ),
        analysis: z.object({
          summary: z
            .string()
            .describe(
              "2-3 sentence narrative of the participant's key positions and values"
            ),
          topThemes: z.array(z.string()).describe("Top 3 themes from the conversation"),
          topicScores: z.array(
            z.object({
              topic: z.string(),
              userPosition: z.string().describe("Brief stance label"),
              alignmentWithMajority: z
                .number()
                .min(0)
                .max(100)
                .describe("0-100 estimate of alignment with typical Swiss opinion"),
            })
          ),
        }),
      })
    ),
  }),
};

export async function POST(req: Request) {
  const { messages, language, deliberationQuestion, interviewType } =
    await req.json();

  // Infer canton from Vercel geo headers
  const headersList = await headers();
  const city = headersList.get("x-vercel-ip-city");
  const country = headersList.get("x-vercel-ip-country");

  let inferredCanton: string | null = null;
  if (country === "CH" && city) {
    inferredCanton = cityToCanton(city);
  }

  // Build system prompt with language and canton directives
  const directives: string[] = [];

  if (interviewType !== "survey" && deliberationQuestion) {
    directives.push(
      `TODAY'S DELIBERATION QUESTION: ${deliberationQuestion}\nFocus the interview on this specific question. All exchanges should explore the participant's views on this topic.`
    );
  }

  if (language) {
    const langName = getLanguageName(language);
    directives.push(
      `IMPORTANT: Respond entirely in ${langName}. Do not ask about language preference.`
    );
  }

  if (inferredCanton) {
    const canton = getCantonById(inferredCanton);
    if (canton) {
      directives.push(
        `The participant appears to be located in ${canton.name} (${canton.id}). Use this as a starting point — confirm with them rather than asking where they are from.`
      );
    }
  }

  const baseSystemPrompt = loadPrompt(interviewType || "deliberation");
  const systemPrompt =
    directives.length > 0
      ? directives.join("\n") + "\n\n" + baseSystemPrompt
      : baseSystemPrompt;

  const tools = interviewType === "survey" ? surveyTools : deliberationTools;

  const result = streamText({
    model: openai.chat("gpt-4o-mini"),
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    system: systemPrompt,
    tools,
  });

  return result.toUIMessageStreamResponse();
}
