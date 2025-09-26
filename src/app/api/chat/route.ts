import { createOpenAI } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { convertToModelMessages, streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";

export const maxDuration = 30;

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitStatus(ip: string): { allowed: boolean; resetTime: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20;

  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, resetTime: now + windowMs };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime };
  }

  // Increment count
  current.count++;
  rateLimitMap.set(ip, current);

  return { allowed: true, resetTime: current.resetTime };
}

function getClientIP(request: Request): string {
  // Try various headers for IP detection
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

const openai = createOpenAI({
  baseURL: "https://api-internal.publicai.co/v1",
  apiKey: process.env.LITELLM_API_KEY,
});

// Load system prompt
const systemPrompt = readFileSync(
  join(process.cwd(), 'src/app/api/chat/system_prompt.md'),
  'utf-8'
);

export async function POST(req: Request) {
  // Rate limiting
  const clientIP = getClientIP(req);
  const { allowed, resetTime } = getRateLimitStatus(clientIP);

  if (!allowed) {
    const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
    return new Response(
      JSON.stringify({
        error: `Too many requests. Please wait ${waitTime} seconds before trying again.`
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': waitTime.toString(),
        }
      }
    );
  }

  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: openai.chat("swiss-ai/apertus-8b-instruct"),
    messages: convertToModelMessages(messages),
    system: systemPrompt,
    tools: {
      ...frontendTools(tools),
      // add backend tools here
    },
  });

  return result.toUIMessageStreamResponse();
}
