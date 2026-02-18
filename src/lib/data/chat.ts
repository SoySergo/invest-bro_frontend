import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, or, desc, asc, and, ilike } from "drizzle-orm";

export async function getUserConversations(userId: string) {
  return db.query.conversations.findMany({
    where: or(
      eq(conversations.buyerId, userId),
      eq(conversations.sellerId, userId)
    ),
    with: {
      listing: true,
      job: true,
      buyer: true,
      seller: true,
      messages: {
        limit: 1,
        orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      },
    },
    orderBy: [desc(conversations.lastMessageAt)],
  });
}

export async function getConversationById(conversationId: string) {
  return db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
    with: {
      buyer: true,
      seller: true,
      listing: true,
      job: true,
    },
  });
}

export async function getConversationMessages(conversationId: string) {
  return db.query.messages.findMany({
    where: eq(messages.conversationId, conversationId),
    orderBy: [asc(messages.createdAt)],
  });
}

export async function searchMessages(userId: string, query: string) {
  const userConversations = await db.query.conversations.findMany({
    where: or(
      eq(conversations.buyerId, userId),
      eq(conversations.sellerId, userId)
    ),
    columns: { id: true },
  });

  const conversationIds = userConversations.map((c) => c.id);
  if (conversationIds.length === 0) return [];

  const results = await db.query.messages.findMany({
    where: and(
      ilike(messages.content, `%${query}%`),
      or(...conversationIds.map((id) => eq(messages.conversationId, id)))
    ),
    orderBy: [desc(messages.createdAt)],
    limit: 50,
  });

  return results;
}

export async function getUnreadMessageCount(userId: string) {
  const userConversations = await db.query.conversations.findMany({
    where: or(
      eq(conversations.buyerId, userId),
      eq(conversations.sellerId, userId)
    ),
    columns: { id: true },
  });

  const conversationIds = userConversations.map((c) => c.id);
  if (conversationIds.length === 0) return 0;

  const unread = await db.query.messages.findMany({
    where: and(
      eq(messages.status, "sent"),
      or(...conversationIds.map((id) => eq(messages.conversationId, id)))
    ),
  });

  // Filter out messages sent by the user themselves
  return unread.filter((m) => m.senderId !== userId).length;
}
