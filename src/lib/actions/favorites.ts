"use server";

import { db } from "@/db";
import { favorites, listings, notifications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function toggleFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const userId = session.user.id;

  try {
    // Check if already favorited
    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.listingId, listingId)
      ),
    });

    if (existing) {
      // Remove from favorites
      await db.delete(favorites).where(eq(favorites.id, existing.id));
      revalidatePath("/favorites");
      revalidatePath("/listings");
      return { success: true, isFavorited: false };
    } else {
      // Add to favorites
      await db.insert(favorites).values({
        userId,
        listingId,
      });

      // Notify the listing owner
      const listing = await db.query.listings.findFirst({
        where: eq(listings.id, listingId),
      });
      if (listing && listing.userId !== userId) {
        await db.insert(notifications).values({
          userId: listing.userId,
          type: "favorite_added",
          title: "Listing favorited",
          body: `Someone added "${listing.title}" to favorites`,
          link: `/listing/${listingId}`,
        });
      }

      revalidatePath("/favorites");
      revalidatePath("/listings");
      return { success: true, isFavorited: true };
    }
  } catch (e) {
    console.error(e);
    return { error: "Failed to toggle favorite" };
  }
}

export async function checkFavorite(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;
  const userId = session.user.id;

  const existing = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, userId),
      eq(favorites.listingId, listingId)
    ),
  });

  return !!existing;
}

export async function getFavoriteListings() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const userId = session.user.id;

  const userFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    with: {
      listing: {
        with: {
          metrics: true,
          category: true,
          user: true,
        },
      },
    },
    orderBy: (favorites, { desc }) => [desc(favorites.createdAt)],
  });

  return userFavorites.map((f) => f.listing).filter(Boolean);
}
