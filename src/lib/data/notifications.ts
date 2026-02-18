import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc, and, count } from "drizzle-orm";

export async function getUserNotifications(userId: string, limit = 20) {
  return db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  const result = await db
    .select({ value: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );
  return result[0]?.value ?? 0;
}
