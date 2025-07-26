import { NextRequest, NextResponse } from 'next/server';
import { getMessagesByConversationId, getConversationById } from '@/lib/queries';
import { stackServerApp } from '@/stack';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get the authenticated user from Stack Auth
    const stackUser = await stackServerApp.getUser();
    
    // Verify the conversation belongs to the user
    const conversation = await getConversationById(id);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Check if the user owns this conversation
    let userOwnsConversation = false;
    
    if (stackUser) {
      // For authenticated users, check if they own the conversation
      userOwnsConversation = conversation.userId === stackUser.id;
    } else {
      // For guest users, allow access to guest conversations only
      // Guest user IDs start with "guest-"
      userOwnsConversation = conversation.userId.startsWith('guest-');
    }
    
    if (!userOwnsConversation) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const messages = await getMessagesByConversationId(id);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}