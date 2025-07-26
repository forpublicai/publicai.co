import { db } from './db';
import { usersTable, conversationsTable, messagesTable, type User, type NewUser, type Conversation, type NewConversation, type Message, type NewMessage } from './schema';
import { eq, desc } from 'drizzle-orm';

// Create a guest user (for current functionality)
export async function createGuestUser(): Promise<User> {
  const [user] = await db.insert(usersTable).values({
    email: `guest-${Date.now()}@example.com`,
    name: 'Guest',
  }).returning();
  return user;
}

// Get or create guest user
export async function getOrCreateGuestUser(): Promise<User> {
  // For now, just create a new guest user each time
  // Later you can implement proper user authentication
  return createGuestUser();
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