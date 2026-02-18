import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, desc, and, gt } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const conversationId = request.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return new Response("Missing conversationId", { status: 400 });
  }

  const encoder = new TextEncoder();
  let lastChecked = new Date();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      sendEvent({ type: "connected" });

      // Poll for new messages every 2 seconds
      const interval = setInterval(async () => {
        try {
          const newMessages = await db.query.messages.findMany({
            where: and(
              eq(messages.conversationId, conversationId),
              gt(messages.createdAt, lastChecked)
            ),
            orderBy: [desc(messages.createdAt)],
          });

          if (newMessages.length > 0) {
            lastChecked = new Date();
            sendEvent({
              type: "new_messages",
              messages: newMessages,
            });
          }
        } catch {
          // Connection may be closed
        }
      }, 2000);

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
