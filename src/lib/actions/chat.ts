"use server";

import { db } from "@/db";
import { conversations, listings, messages, jobs, notifications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
        type: "listing",
        listingId,
        buyerId: currentUserId,
        sellerId: listing.userId,
    }).returning();

    // Create notification for the seller
    await db.insert(notifications).values({
        userId: listing.userId,
        type: "chat_invitation",
        title: "New conversation",
        body: `Someone wants to discuss "${listing.title}"`,
        link: `/chat/${newConv.id}`,
    });

    redirect(`/chat/${newConv.id}`);
}

export async function startInvestorChat(investorUserId: string, listingId?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");
    const currentUserId = session.user.id;

    if (investorUserId === currentUserId) return;

    // Check if conversation exists
    const existing = await db.query.conversations.findFirst({
        where: and(
            eq(conversations.type, "investment"),
            eq(conversations.buyerId, currentUserId),
            eq(conversations.sellerId, investorUserId),
            ...(listingId ? [eq(conversations.listingId, listingId)] : [])
        )
    });

    if (existing) {
        redirect(`/chat/${existing.id}`);
    }

    const [newConv] = await db.insert(conversations).values({
        type: "investment",
        listingId: listingId || null,
        buyerId: currentUserId,
        sellerId: investorUserId,
    }).returning();

    await db.insert(notifications).values({
        userId: investorUserId,
        type: "chat_invitation",
        title: "New investment inquiry",
        body: "Someone wants to discuss an investment opportunity",
        link: `/chat/${newConv.id}`,
    });

    redirect(`/chat/${newConv.id}`);
}

export async function startJobChat(jobId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");
    const currentUserId = session.user.id;

    const job = await db.query.jobs.findFirst({
        where: eq(jobs.id, jobId)
    });

    if (!job) throw new Error("Job not found");
    if (job.userId === currentUserId) return;

    const existing = await db.query.conversations.findFirst({
        where: and(
            eq(conversations.type, "job"),
            eq(conversations.jobId, jobId),
            eq(conversations.buyerId, currentUserId),
            eq(conversations.sellerId, job.userId)
        )
    });

    if (existing) {
        redirect(`/chat/${existing.id}`);
    }

    const [newConv] = await db.insert(conversations).values({
        type: "job",
        jobId,
        buyerId: currentUserId,
        sellerId: job.userId,
    }).returning();

    await db.insert(notifications).values({
        userId: job.userId,
        type: "chat_invitation",
        title: "New job inquiry",
        body: `Someone wants to discuss "${job.title}"`,
        link: `/chat/${newConv.id}`,
    });

    redirect(`/chat/${newConv.id}`);
}

export async function sendMessage(conversationId: string, formData: FormData) {
    const content = formData.get("content") as string;
    if (!content) return;

    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");
    const currentUserId = session.user.id;

    const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
    });

    if (!conversation) throw new Error("Conversation not found");

    await db.insert(messages).values({
        conversationId,
        senderId: currentUserId,
        content,
        status: "sent",
    });

    await db.update(conversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(conversations.id, conversationId));

    // Notify the other party
    const recipientId = conversation.buyerId === currentUserId
        ? conversation.sellerId
        : conversation.buyerId;

    await db.insert(notifications).values({
        userId: recipientId,
        type: "new_message",
        title: "New message",
        body: content.length > 100 ? content.substring(0, 100) + "..." : content,
        link: `/chat/${conversationId}`,
    });

    revalidatePath(`/chat/${conversationId}`);
    revalidatePath(`/chat`);
}

export async function markMessagesRead(conversationId: string) {
    const session = await auth();
    if (!session?.user?.id) return;
    const currentUserId = session.user.id;

    // Verify user is a participant in this conversation
    const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
    });

    if (!conversation) return;
    if (conversation.buyerId !== currentUserId && conversation.sellerId !== currentUserId) return;

    // Only mark messages from the OTHER user as read (not our own)
    const otherUserId = conversation.buyerId === currentUserId
        ? conversation.sellerId
        : conversation.buyerId;

    await db.update(messages)
        .set({ status: "read", readAt: new Date() })
        .where(
            and(
                eq(messages.conversationId, conversationId),
                eq(messages.senderId, otherUserId),
                eq(messages.status, "sent")
            )
        );

    revalidatePath(`/chat/${conversationId}`);
    revalidatePath(`/chat`);
}
