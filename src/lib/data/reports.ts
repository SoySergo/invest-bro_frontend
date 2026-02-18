import { db } from "@/db";
import { reports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getReports(status?: string) {
  const where = status ? eq(reports.status, status as "pending" | "reviewed" | "resolved" | "dismissed") : undefined;

  return db.query.reports.findMany({
    where,
    with: {
      reporter: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      reportedUser: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      listing: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [desc(reports.createdAt)],
  });
}

export async function getReportsForListing(listingId: string) {
  return db.query.reports.findMany({
    where: eq(reports.listingId, listingId),
    with: {
      reporter: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [desc(reports.createdAt)],
  });
}
