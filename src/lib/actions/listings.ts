"use server";

import { db } from "@/db";
import { listings, users } from "@/db/schema";
import { ListingFormData, listingSchema } from "@/lib/schemas/listing";
import { revalidatePath } from "next/cache";

export async function createListing(data: ListingFormData) {
  const result = listingSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  // TODO: Get actual logged in user
  // For now, get the first user or create a seeded one
  let user = await db.query.users.findFirst();
  if (!user) {
    [user] = await db.insert(users).values({
      email: "demo@investbro.com",
      name: "Demo User",
    }).returning();
  }

  // Resolve Category ID
  const category = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.slug, result.data.category),
  });

  if (!category) {
      return { error: "Invalid category" };
  }

  try {
    const [stats] = await db.insert(listings).values({
        userId: user.id,
        categoryId: category.id,
        title: result.data.title,
        description: result.data.description,
        price: result.data.price?.toString() || "0",
        currency: result.data.currency,
        location: result.data.location,
        locationType: result.data.type,
        
        yearlyRevenue: result.data.yearlyRevenue?.toString(),
        yearlyProfit: result.data.yearlyProfit?.toString(),
        
        status: "active",
    } as any).returning(); 
    
    revalidatePath("/listings");
    return { success: true, id: stats.id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create listing" };
  }
}
