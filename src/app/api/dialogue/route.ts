import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";

export const maxDuration = 30;

const openai = createOpenAI({
  baseURL: "https://api-internal.publicai.co/v1",
  apiKey: process.env.LITELLM_API_KEY,
});

const systemPrompt = readFileSync(
  join(process.cwd(), "src/app/api/dialogue/interview_prompt.md"),
  "utf-8"
);

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Support both UIMessage[] (from assistant-ui) and simple {role, content} format
  const isSimpleFormat =
    messages?.length > 0 && typeof messages[0].content === "string";

  const modelMessages = isSimpleFormat
    ? messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    : convertToModelMessages(messages);

  const result = streamText({
    model: openai.chat("swiss-ai/apertus-70b-instruct"),
    messages: modelMessages,
    system: systemPrompt,
  });

  return result.toUIMessageStreamResponse();
}
