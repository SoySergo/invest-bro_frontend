"use server";

import { db } from "@/db";
import { conversations, users, listings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "@/i18n/routing";
import { revalidatePath } from "next/cache";
import { messages } from "@/db/schema";

export async function startChat(listingId: string) {
    // Mock user
   const currentUser = await db.query.users.findFirst();
   if (!currentUser) throw new Error("Not logged in");

   const listing = await db.query.listings.findFirst({
       where: eq(listings.id, listingId)
   });
   
   if (!listing) throw new Error("Listing not found");
   
   if (listing.userId === currentUser.id) {
       // Cannot chat with self
       // In real app, just redirect to chats
       return;
   }

   // Check if conversation exists
   const existing = await db.query.conversations.findFirst({
       where: and(
           eq(conversations.listingId, listingId),
           eq(conversations.buyerId, currentUser.id),
           eq(conversations.sellerId, listing.userId)
       )
   });

   if (existing) {
       redirect(`/chat/${existing.id}`);
   }

   const [newConv] = await db.insert(conversations).values({
       listingId,
       buyerId: currentUser.id,
       sellerId: listing.userId,
   } as any).returning();

   redirect(`/chat/${newConv.id}`);
}

export async function sendMessage(conversationId: string, formData: FormData) {
    const content = formData.get("content") as string;
    if (!content) return;

    // Mock user
    const currentUser = await db.query.users.findFirst();
    if (!currentUser) throw new Error("Not logged in");

    await db.insert(messages).values({
        conversationId,
        senderId: currentUser.id,
        content,
    } as any);

    await db.update(conversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(conversations.id, conversationId));

    revalidatePath(`/chat/${conversationId}`);
    revalidatePath(`/chat`);
}
