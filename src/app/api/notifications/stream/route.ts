import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial unread count
      const countResult = await db
        .select({ value: count() })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.isRead, false)
          )
        );
      const unreadCount = countResult[0]?.value ?? 0;
      sendEvent({ type: "init", unreadCount });

      // Poll for new notifications every 5 seconds
      const interval = setInterval(async () => {
        try {
          const latestCountResult = await db
            .select({ value: count() })
            .from(notifications)
            .where(
              and(
                eq(notifications.userId, userId),
                eq(notifications.isRead, false)
              )
            );
          const latestCount = latestCountResult[0]?.value ?? 0;

          const latestUnread = await db.query.notifications.findMany({
            where: and(
              eq(notifications.userId, userId),
              eq(notifications.isRead, false)
            ),
            orderBy: [desc(notifications.createdAt)],
            limit: 5,
          });

          sendEvent({
            type: "update",
            unreadCount: latestCount,
            latest: latestUnread,
          });
        } catch {
          // Connection may be closed
        }
      }, 5000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
