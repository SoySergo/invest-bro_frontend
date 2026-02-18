import type { MetadataRoute } from "next";
import { db } from "@/db";
import { listings, categories } from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://investbro.eu";
const LOCALES = ["en", "fr", "es", "pt", "de", "it", "nl", "ru"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/listings",
    "/investors",
    "/jobs",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "daily" as const : "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  // Active listings
  const activeListings = await db.query.listings.findMany({
    where: eq(listings.status, "active"),
    columns: { id: true, updatedAt: true },
  });

  const listingEntries: MetadataRoute.Sitemap = activeListings.flatMap((listing) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/listing/${listing.id}`,
      lastModified: listing.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // Categories
  const allCategories = await db.query.categories.findMany({
    columns: { slug: true },
    orderBy: [asc(categories.order)],
  });

  const categoryEntries: MetadataRoute.Sitemap = allCategories.flatMap((cat) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...listingEntries, ...categoryEntries];
}
