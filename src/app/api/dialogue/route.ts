import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";
import { headers } from "next/headers";
import { cityToCanton, getLanguageName } from "@/lib/languages";
import { getCantonById } from "@/components/dialogue/mockAnalytics";

export const maxDuration = 60;

const baseSystemPrompt = readFileSync(
  join(process.cwd(), "src/app/api/dialogue/interview_prompt.md"),
  "utf-8"
);

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, language } = await req.json();

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

  const systemPrompt =
    directives.length > 0
      ? directives.join("\n") + "\n\n" + baseSystemPrompt
      : baseSystemPrompt;

  const result = streamText({
    model: openrouter.chat("google/gemini-3.1-flash-lite-preview"),
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    system: systemPrompt,
  });

  return result.toUIMessageStreamResponse();
}
