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
