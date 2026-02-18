import { db } from "@/db";
import { users, listings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  return user ?? null;
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userListings = await db.query.listings.findMany({
    where: eq(listings.userId, session.user.id),
    with: {
      category: true,
      metrics: true,
    },
    orderBy: (listings, { desc }) => [desc(listings.createdAt)],
  });

  return userListings;
}
