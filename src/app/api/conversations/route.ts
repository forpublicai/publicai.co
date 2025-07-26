import { NextRequest, NextResponse } from 'next/server';
import { createConversation, getConversationsByUserId, createGuestUserId } from '@/lib/queries';
import { stackServerApp } from '@/stack';

export async function GET() {
  try {
    // Get the authenticated user from Stack Auth
    const stackUser = await stackServerApp.getUser();
    
    if (!stackUser) {
      // Return empty array for unauthenticated users
      return NextResponse.json({ conversations: [] });
    }
    
    // Use Stack Auth user ID to get conversations
    const conversations = await getConversationsByUserId(stackUser.id);
    
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, model } = await req.json();
    
    // Get the authenticated user from Stack Auth
    const stackUser = await stackServerApp.getUser();
    
    let userId: string;
    
    if (stackUser) {
      // Use authenticated user ID for logged-in users
      userId = stackUser.id;
    } else {
      // Create a guest user ID for unauthenticated users
      userId = createGuestUserId();
    }
    
    const conversation = await createConversation(userId, title, model);
    
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}