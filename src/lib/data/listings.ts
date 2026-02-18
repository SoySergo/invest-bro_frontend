import { db } from "@/db";
import { listings, categories } from "@/db/schema";
import { eq, and, ilike, desc, or } from "drizzle-orm";

export type ListingsFilters = {
  search?: string;
  type?: string;
  category?: string;
};

export async function getListings(filters?: ListingsFilters) {
  const where = [];

  // Filter by type (online/offline)
  if (filters?.type) {
    where.push(eq(listings.locationType, filters.type));
  }

  // Filter by category slug
  if (filters?.category) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, filters.category),
    });
    if (category) {
      where.push(eq(listings.categoryId, category.id));
    }
  }

  // Search by title or description
  if (filters?.search) {
    where.push(
      or(
        ilike(listings.title, `%${filters.search}%`),
        ilike(listings.description, `%${filters.search}%`)
      )!
    );
  }

  // Only show active listings
  where.push(eq(listings.status, "active"));

  const allListings = await db.query.listings.findMany({
    where: where.length > 0 ? and(...where) : undefined,
    with: {
      metrics: true,
      category: true,
      user: true,
    },
    orderBy: (listings, { desc }) => [desc(listings.createdAt)],
  });

  return allListings;
}

/**
 * Get similar listings by category and price range.
 */
export async function getSimilarListings(listingId: string, limit: number = 6) {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
  });

  if (!listing) return [];

  const price = Number(listing.price) || 0;
  const priceMin = price * 0.5;
  const priceMax = price * 2;

  const allActive = await db.query.listings.findMany({
    where: eq(listings.status, "active"),
    with: {
      metrics: true,
      category: true,
      user: true,
    },
    orderBy: (listings, { desc }) => [desc(listings.createdAt)],
  });

  // Score each listing by similarity
  const scored = allActive
    .filter((l) => l.id !== listingId)
    .map((l) => {
      let score = 0;
      if (l.categoryId === listing.categoryId) score += 3;
      if (l.category?.parentId && listing.categoryId) {
        // Same parent category
        if (l.category.parentId === listing.categoryId) score += 1;
      }
      const lPrice = Number(l.price) || 0;
      if (lPrice >= priceMin && lPrice <= priceMax) score += 2;
      if (l.country === listing.country) score += 1;
      if (l.locationType === listing.locationType) score += 1;
      return { listing: l, score };
    });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.listing);
}

/**
 * Get listings by category slug (for category page)
 */
export async function getListingsByCategorySlug(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) return [];

  // Also include subcategory listings
  const subcategories = await db.query.categories.findMany({
    where: eq(categories.parentId, category.id),
  });
  const categoryIds = [category.id, ...subcategories.map((c) => c.id)];

  const allActive = await db.query.listings.findMany({
    where: eq(listings.status, "active"),
    with: {
      metrics: true,
      category: true,
      user: true,
    },
    orderBy: (listings, { desc }) => [desc(listings.createdAt)],
  });

  return allActive.filter((l) => categoryIds.includes(l.categoryId!));
}
