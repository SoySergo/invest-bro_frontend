import { db } from "@/db";
import { listings, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getListingById(id: string) {
  const listing = await db.query.listings.findFirst({
    where: eq(listings.id, id),
    with: {
      metrics: true,
      category: true,
      user: {
        columns: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
        }
      },
      images: true,
    },
  });
  return listing;
}
