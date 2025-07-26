import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateGuestUser, createConversation, getConversationsByUserId } from '@/lib/queries';

export async function GET() {
  try {
    // For now, use a guest user - replace with proper auth later
    const user = await getOrCreateGuestUser();
    const conversations = await getConversationsByUserId(user.id);
    
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
    
    // For now, use a guest user - replace with proper auth later
    const user = await getOrCreateGuestUser();
    const conversation = await createConversation(user.id, title, model);
    
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}