"use server";

import { db } from "@/db";
import { listings, investorProfiles, jobs } from "@/db/schema";
import { eq, and, ilike, or, desc } from "drizzle-orm";

export interface SearchResults {
  listings: {
    id: string;
    title: string;
    locationType: string | null;
    country: string | null;
    price: string | null;
    categoryName: string | null;
  }[];
  investors: {
    id: string;
    userName: string | null;
    company: string | null;
    type: string;
    country: string | null;
  }[];
  jobs: {
    id: string;
    title: string;
    company: string | null;
    level: string;
    country: string | null;
  }[];
}

export async function globalSearch(query: string): Promise<SearchResults> {
  if (!query || query.length < 2) {
    return { listings: [], investors: [], jobs: [] };
  }

  const searchPattern = `%${query}%`;

  // Search listings
  const matchedListings = await db.query.listings.findMany({
    where: and(
      eq(listings.status, "active"),
      or(
        ilike(listings.title, searchPattern),
        ilike(listings.description, searchPattern)
      )
    ),
    with: { category: true },
    orderBy: [desc(listings.createdAt)],
    limit: 5,
  });

  // Search investor profiles (through user name/company)
  const matchedInvestorProfiles = await db.query.investorProfiles.findMany({
    where: eq(investorProfiles.isPublic, true),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          company: true,
          country: true,
        },
      },
    },
    orderBy: [desc(investorProfiles.createdAt)],
    limit: 20,
  });

  const filteredInvestors = matchedInvestorProfiles
    .filter((p) => {
      const lowerQuery = query.toLowerCase();
      return (
        p.user.name?.toLowerCase().includes(lowerQuery) ||
        p.user.company?.toLowerCase().includes(lowerQuery) ||
        p.type?.toLowerCase().includes(lowerQuery)
      );
    })
    .slice(0, 5);

  // Search jobs
  const matchedJobs = await db.query.jobs.findMany({
    where: and(
      eq(jobs.status, "active"),
      or(
        ilike(jobs.title, searchPattern),
        ilike(jobs.description, searchPattern)
      )
    ),
    with: {
      user: {
        columns: {
          id: true,
          company: true,
        },
      },
    },
    orderBy: [desc(jobs.createdAt)],
    limit: 5,
  });

  return {
    listings: matchedListings.map((l) => ({
      id: l.id,
      title: l.title,
      locationType: l.locationType,
      country: l.country,
      price: l.price,
      categoryName: l.category?.nameEn || null,
    })),
    investors: filteredInvestors.map((p) => ({
      id: p.id,
      userName: p.user.name,
      company: p.user.company,
      type: p.type,
      country: p.user.country,
    })),
    jobs: matchedJobs.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.user?.company || null,
      level: j.level,
      country: j.country,
    })),
  };
}
