"use server";

import { db } from "@/db";
import { listings, listingImages } from "@/db/schema";
import { ListingFormData, listingSchema } from "@/lib/schemas/listing";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

interface ImageData {
  url: string;
  key: string;
  order: number;
}

export async function createListing(data: ListingFormData, images?: ImageData[]) {
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
    const [created] = await db.insert(listings).values({
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

    if (images && images.length > 0) {
      await db.insert(listingImages).values(
        images.map((img) => ({
          listingId: created.id,
          url: img.url,
          order: img.order,
        }))
      );
    }

    revalidatePath("/listings");
    return { success: true, id: created.id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create listing" };
  }
}

export async function editListing(listingId: string, data: ListingFormData, images?: ImageData[]) {
  const result = listingSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.listings.findFirst({
    where: and(eq(listings.id, listingId), eq(listings.userId, userId)),
  });

  if (!existing) {
    return { error: "Listing not found or access denied" };
  }

  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, result.data.category),
  });

  if (!category) {
    return { error: "Invalid category" };
  }

  try {
    await db.update(listings).set({
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
      updatedAt: new Date(),
    }).where(eq(listings.id, listingId));

    if (images) {
      await db.delete(listingImages).where(eq(listingImages.listingId, listingId));
      if (images.length > 0) {
        await db.insert(listingImages).values(
          images.map((img) => ({
            listingId,
            url: img.url,
            order: img.order,
          }))
        );
      }
    }

    revalidatePath("/listings");
    revalidatePath(`/listing/${listingId}`);
    return { success: true, id: listingId };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update listing" };
  }
}

export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.listings.findFirst({
    where: and(eq(listings.id, listingId), eq(listings.userId, userId)),
  });

  if (!existing) {
    return { error: "Listing not found or access denied" };
  }

  try {
    await db.update(listings).set({
      status: "hidden",
      updatedAt: new Date(),
    }).where(eq(listings.id, listingId));

    revalidatePath("/listings");
    revalidatePath(`/listing/${listingId}`);
    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete listing" };
  }
}

export async function changeListingStatus(listingId: string, status: "active" | "draft" | "sold" | "hidden") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.listings.findFirst({
    where: and(eq(listings.id, listingId), eq(listings.userId, userId)),
  });

  if (!existing) {
    return { error: "Listing not found or access denied" };
  }

  try {
    await db.update(listings).set({
      status,
      updatedAt: new Date(),
    }).where(eq(listings.id, listingId));

    revalidatePath("/listings");
    revalidatePath(`/listing/${listingId}`);
    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update status" };
  }
}
