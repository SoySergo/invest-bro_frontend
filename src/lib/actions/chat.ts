"use server";

import { db } from "@/db";
import { conversations, listings } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { messages } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function startChat(listingId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");
    const currentUserId = session.user.id;

    const listing = await db.query.listings.findFirst({
        where: eq(listings.id, listingId)
    });

    if (!listing) throw new Error("Listing not found");

    if (listing.userId === currentUserId) {
        return;
    }

    // Check if conversation exists
    const existing = await db.query.conversations.findFirst({
        where: and(
            eq(conversations.listingId, listingId),
            eq(conversations.buyerId, currentUserId),
            eq(conversations.sellerId, listing.userId)
        )
    });

    if (existing) {
        redirect(`/chat/${existing.id}`);
    }

    const [newConv] = await db.insert(conversations).values({
        listingId,
        buyerId: currentUserId,
        sellerId: listing.userId,
    }).returning();

    redirect(`/chat/${newConv.id}`);
}

export async function sendMessage(conversationId: string, formData: FormData) {
    const content = formData.get("content") as string;
    if (!content) return;

    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");
    const currentUserId = session.user.id;

    await db.insert(messages).values({
        conversationId,
        senderId: currentUserId,
        content,
    } as any);

    await db.update(conversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(conversations.id, conversationId));

    revalidatePath(`/chat/${conversationId}`);
    revalidatePath(`/chat`);
}
