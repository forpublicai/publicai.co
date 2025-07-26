import { db } from './db';
import { usersTable, conversationsTable, messagesTable, type User, type Conversation, type Message } from './schema';
import { eq, desc } from 'drizzle-orm';

// Note: Authenticated users are managed by Stack Auth in neon_auth.users_sync
// Guest users need special handling since they don't exist in Stack Auth

// For guest users, we'll use a special guest user ID pattern
export function createGuestUserId(): string {
  return `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create conversation
export async function createConversation(userId: string, title?: string, model?: string): Promise<Conversation> {
  const [conversation] = await db.insert(conversationsTable).values({
    userId,
    title: title || 'New Chat',
    model: model || 'anthropic/claude-3.5-sonnet',
  }).returning();
  return conversation;
}

// Get conversations for user
export async function getConversationsByUserId(userId: string): Promise<Conversation[]> {
  return db.select()
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, userId))
    .orderBy(desc(conversationsTable.updatedAt));
}

// Get conversation by ID
export async function getConversationById(id: string): Promise<Conversation | null> {
  const results = await db.select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id))
    .limit(1);
  
  return results[0] || null;
}

// Update conversation title and timestamp
export async function updateConversation(id: string, updates: { title?: string }): Promise<void> {
  await db.update(conversationsTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(conversationsTable.id, id));
}

// Add message to conversation
export async function addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
  const [message] = await db.insert(messagesTable).values({
    conversationId,
    role,
    content,
  }).returning();
  
  // Update conversation timestamp
  await db.update(conversationsTable)
    .set({ updatedAt: new Date() })
    .where(eq(conversationsTable.id, conversationId));
  
  return message;
}

// Get messages for conversation
export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  return db.select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(messagesTable.createdAt);
}