"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createNotification(data: {
  userId: string;
  type: "new_message" | "job_application" | "favorite_added" | "chat_invitation";
  title: string;
  body?: string;
  link?: string;
}) {
  try {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId: data.userId,
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link,
      })
      .returning();
    return { success: true, data: notification };
  } catch {
    return { success: false, error: "Failed to create notification" };
  }
}

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id)
        )
      );
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to mark notification as read" };
  }
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.isRead, false)
        )
      );
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to mark all notifications as read" };
  }
}
