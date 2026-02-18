import { db } from "@/db";
import { investorProfiles, listings } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export interface InvestorFilters {
  type?: string;
  stage?: string;
  industry?: string;
  country?: string;
  participationType?: string;
}

export async function getInvestors(filters?: InvestorFilters) {
  const where = [eq(investorProfiles.isPublic, true)];

  if (filters?.type) {
    where.push(eq(investorProfiles.type, filters.type as "angel" | "vc" | "private" | "strategic" | "institutional"));
  }

  if (filters?.participationType) {
    where.push(eq(investorProfiles.participationType, filters.participationType));
  }

  const allProfiles = await db.query.investorProfiles.findMany({
    where: and(...where),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          company: true,
          country: true,
          city: true,
          createdAt: true,
        },
      },
    },
    orderBy: [desc(investorProfiles.createdAt)],
  });

  let result = allProfiles;

  if (filters?.stage) {
    result = result.filter((p) => {
      const stages = p.stages as string[] | null;
      return stages?.includes(filters.stage!) ?? false;
    });
  }

  if (filters?.industry) {
    result = result.filter((p) => {
      const industries = p.industries as string[] | null;
      return industries?.includes(filters.industry!) ?? false;
    });
  }

  if (filters?.country) {
    result = result.filter((p) => {
      const geoFocus = p.geoFocus as string[] | null;
      return geoFocus?.includes(filters.country!) ?? false;
    });
  }

  return result;
}

export async function getInvestorById(id: string) {
  const profile = await db.query.investorProfiles.findFirst({
    where: eq(investorProfiles.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          company: true,
          country: true,
          city: true,
          bio: true,
          website: true,
          createdAt: true,
        },
      },
    },
  });
  return profile;
}

export async function getMatchingInvestors(listingId: string, limit: number = 5) {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, listingId),
    with: { category: true },
  });

  if (!listing) return [];

  const allPublicProfiles = await db.query.investorProfiles.findMany({
    where: eq(investorProfiles.isPublic, true),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          company: true,
          country: true,
        },
      },
    },
  });

  const categorySlug = listing.category?.slug || "";

  const scored = allPublicProfiles.map((profile) => {
    let score = 0;
    const industries = profile.industries as string[] | null;
    const stages = profile.stages as string[] | null;
    const geoFocus = profile.geoFocus as string[] | null;

    if (industries && categorySlug) {
      const categoryTokens = categorySlug.split("-");
      for (const ind of industries) {
        if (categorySlug.includes(ind) || categoryTokens.some((t) => ind.includes(t))) {
          score += 2;
        }
      }
      if (industries.includes("generalist")) score += 1;
    }

    if (stages && stages.length > 0) {
      if (stages.includes("seed") || stages.includes("pre-seed")) score += 1;
    }

    if (geoFocus && listing.country) {
      if (geoFocus.includes(listing.country)) score += 1;
    }

    return { profile, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.profile);
}

export async function getMatchingListings(investorProfileId: string, limit: number = 6) {
  const profile = await db.query.investorProfiles.findFirst({
    where: eq(investorProfiles.id, investorProfileId),
  });

  if (!profile) return [];

  const industries = profile.industries as string[] | null;
  const geoFocus = profile.geoFocus as string[] | null;

  const activeListings = await db.query.listings.findMany({
    where: eq(listings.status, "active"),
    with: {
      category: true,
      metrics: true,
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [desc(listings.createdAt)],
  });

  const scored = activeListings.map((listing) => {
    let score = 0;
    const categorySlug = listing.category?.slug || "";

    if (industries && categorySlug) {
      const categoryTokens = categorySlug.split("-");
      for (const ind of industries) {
        if (categorySlug.includes(ind) || categoryTokens.some((t) => ind.includes(t))) {
          score += 2;
        }
      }
    }

    if (geoFocus && listing.country) {
      if (geoFocus.includes(listing.country)) score += 1;
    }

    return { listing, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.listing);
}
