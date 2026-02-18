"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { profileSchema, type ProfileFormData } from "@/lib/schemas/profile";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: ProfileFormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const result = profileSchema.safeParse(data);
  if (!result.success) return { error: "Invalid data" };

  try {
    await db
      .update(users)
      .set({
        name: result.data.name,
        bio: result.data.bio || null,
        company: result.data.company || null,
        website: result.data.website || null,
        phone: result.data.phone || null,
        country: result.data.country || null,
        city: result.data.city || null,
      })
      .where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update profile" };
  }
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await db.delete(users).where(eq(users.id, session.user.id));
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete account" };
  }
}
