"use server";

import { db } from "@/db";
import { reviews, listings, conversations } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/schemas/review";

export async function submitReview(data: {
  toUserId: string;
  listingId?: string;
  rating: number;
  comment?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data" };

  const { toUserId, listingId, rating, comment } = parsed.data;

  // Cannot review yourself
  if (toUserId === session.user.id) {
    return { success: false, error: "Cannot review yourself" };
  }

  try {
    // Check if a conversation exists between the users (for the listing if specified)
    if (listingId) {
      const listing = await db.query.listings.findFirst({
        where: eq(listings.id, listingId),
      });

      if (!listing) {
        return { success: false, error: "Listing not found" };
      }

      // Verify conversation exists between these users for this listing
      const conversation = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.listingId, listingId),
          or(
            and(eq(conversations.buyerId, session.user.id), eq(conversations.sellerId, toUserId)),
            and(eq(conversations.sellerId, session.user.id), eq(conversations.buyerId, toUserId)),
          ),
        ),
      });

      if (!conversation) {
        return { success: false, error: "No conversation found for this listing" };
      }
    }

    // Check if already reviewed this user for this listing
    const existing = await db.query.reviews.findFirst({
      where: listingId
        ? and(
            eq(reviews.fromUserId, session.user.id),
            eq(reviews.toUserId, toUserId),
            eq(reviews.listingId, listingId),
          )
        : and(
            eq(reviews.fromUserId, session.user.id),
            eq(reviews.toUserId, toUserId),
          ),
    });

    if (existing) {
      return { success: false, error: "Already reviewed" };
    }

    await db.insert(reviews).values({
      fromUserId: session.user.id,
      toUserId,
      listingId: listingId || null,
      rating,
      comment: comment || null,
    });

    revalidatePath(`/listing/${listingId}`);
    revalidatePath(`/profile`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function deleteReview(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Only the reviewer or admin can delete
    if (review.fromUserId !== session.user.id && session.user.role !== "admin") {
      return { success: false, error: "Not authorized" };
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    revalidatePath(`/listing/${review.listingId}`);
    revalidatePath(`/profile`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to delete review" };
  }
}
