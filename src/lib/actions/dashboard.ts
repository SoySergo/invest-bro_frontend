"use server";

import { db } from "@/db";
import { listingViews, promotedListings, premiumSubscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function recordListingView(listingId: string) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  try {
    await db.insert(listingViews).values({
      listingId,
      userId,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to record view" };
  }
}

export async function promoteListing(listingId: string, duration: "7" | "14" | "30") {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(duration));

    await db.insert(promotedListings).values({
      listingId,
      userId: session.user.id,
      duration,
      startDate,
      endDate,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to promote listing" };
  }
}

export async function subscribePremium() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await db.insert(premiumSubscriptions).values({
      userId: session.user.id,
      status: "active",
      startDate,
      endDate,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to subscribe" };
  }
}
