"use server";

import { db } from "@/db";
import { listings } from "@/db/schema";
import { ListingFormData, listingSchema } from "@/lib/schemas/listing";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createListing(data: ListingFormData) {
  const result = listingSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const userId = session.user.id;

  // Resolve Category ID
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, result.data.category),
  });

  if (!category) {
    return { error: "Invalid category" };
  }

  try {
    const [stats] = await db.insert(listings).values({
      userId,
      categoryId: category.id,
      title: result.data.title,
      description: result.data.description,
      price: result.data.price?.toString() || "0",
      currency: result.data.currency || "EUR",
      country: result.data.country || null,
      city: result.data.city || null,
      locationType: result.data.type,

      yearlyRevenue: result.data.yearlyRevenue?.toString(),
      yearlyProfit: result.data.yearlyProfit?.toString(),

      status: "active",
    }).returning();

    revalidatePath("/listings");
    return { success: true, id: stats.id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create listing" };
  }
}
