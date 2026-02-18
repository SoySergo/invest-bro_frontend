"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function requestVerification() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) return { success: false, error: "User not found" };

    if (user.verificationStatus === "verified") {
      return { success: false, error: "Already verified" };
    }

    if (user.verificationStatus === "pending") {
      return { success: false, error: "Verification already requested" };
    }

    await db.update(users).set({
      verificationStatus: "pending",
    }).where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to request verification" };
  }
}

export async function updateVerificationStatus(userId: string, status: "verified" | "rejected") {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, error: "Not authorized" };
  }

  try {
    await db.update(users).set({
      verificationStatus: status,
      verifiedAt: status === "verified" ? new Date() : null,
    }).where(eq(users.id, userId));

    revalidatePath("/admin/verifications");
    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update verification" };
  }
}

export async function toggleBlockUser(userId: string, block: boolean, reason?: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, error: "Not authorized" };
  }

  // Cannot block yourself
  if (userId === session.user.id) {
    return { success: false, error: "Cannot block yourself" };
  }

  try {
    await db.update(users).set({
      isBlocked: block,
      blockedAt: block ? new Date() : null,
      blockReason: block ? (reason || null) : null,
    }).where(eq(users.id, userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update user block status" };
  }
}
