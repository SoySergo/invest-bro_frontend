"use server";

import { db } from "@/db";
import { favorites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Mock user for MVP - get first user
async function getMockUserId() {
  const u = await db.query.users.findFirst();
  return u?.id;
}

export async function toggleFavorite(listingId: string) {
  const userId = await getMockUserId();
  if (!userId) {
    return { error: "Not logged in" };
  }

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
  const userId = await getMockUserId();
  if (!userId) return false;

  const existing = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, userId),
      eq(favorites.listingId, listingId)
    ),
  });

  return !!existing;
}

export async function getFavoriteListings() {
  const userId = await getMockUserId();
  if (!userId) return [];

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
