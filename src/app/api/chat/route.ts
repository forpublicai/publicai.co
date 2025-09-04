import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Rate limiting
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 20;
const MAX_MESSAGE_LENGTH = 10000;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const client = rateLimits.get(clientIP);
  
  if (!client || now > client.resetTime) {
    // Reset or create new rate limit window
    rateLimits.set(clientIP, { count: 1, resetTime: now + 60000 });
    return false;
  }
  
  if (client.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }
  
  client.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "swiss-ai/apertus-8b-instruct" } = await req.json();
    
    // Rate limiting check
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }
    
    // Message length validation
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content?.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'Message too long. Please keep messages under 10000 characters.' },
        { status: 400 }
      );
    }

    // Create client for Swiss AI API
    const client = new OpenAI({
      apiKey: process.env.LITELLM_API_KEY!,
      baseURL: "https://api-internal.publicai.co/v1",
      timeout: 15000, // 15 second timeout
    });

    // Read system prompt from file
    const systemPromptPath = join(process.cwd(), 'src/app/api/chat/system_prompt.md');
    const systemPromptContent = readFileSync(systemPromptPath, 'utf-8');
    
    const systemPrompt = {
      role: "system" as const,
      content: systemPromptContent
    };

    const messagesWithSystem = [systemPrompt, ...messages];
    
    const stream = await client.chat.completions.create({
      model,
      messages: messagesWithSystem,
      stream: true,
    });

    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}