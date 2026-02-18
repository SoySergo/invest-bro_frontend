import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, desc, avg, count } from "drizzle-orm";

export async function getReviewsForUser(userId: string) {
  return db.query.reviews.findMany({
    where: eq(reviews.toUserId, userId),
    with: {
      fromUser: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
      listing: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [desc(reviews.createdAt)],
  });
}

export async function getUserRating(userId: string) {
  const result = await db
    .select({
      avgRating: avg(reviews.rating),
      totalReviews: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.toUserId, userId));

  const row = result[0];
  return {
    averageRating: row?.avgRating ? parseFloat(String(row.avgRating)) : 0,
    totalReviews: Number(row?.totalReviews) || 0,
  };
}

export async function getReviewsForListing(listingId: string) {
  return db.query.reviews.findMany({
    where: eq(reviews.listingId, listingId),
    with: {
      fromUser: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [desc(reviews.createdAt)],
  });
}
