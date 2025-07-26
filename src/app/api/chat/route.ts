import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/queries';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "anthropic/claude-3.5-sonnet", conversationId } = await req.json();

    // Save user message to database if conversationId is provided
    if (conversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        await addMessage(conversationId, 'user', lastMessage.content);
      }
    }

    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    let assistantResponse = '';
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              assistantResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          // Save assistant response to database
          if (conversationId && assistantResponse) {
            await addMessage(conversationId, 'assistant', assistantResponse);
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
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}