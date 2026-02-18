import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { ChatMessages } from "@/components/shared/chat-messages";
import { ChatContextCard } from "@/components/shared/chat-context-card";

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations("Chat");
    const session = await auth();
    const currentUserId = session?.user?.id;

    if (!currentUserId) return <div>{t("pleaseLogin")}</div>;

    const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, id),
        with: {
            buyer: true,
            seller: true,
            listing: true,
            job: true,
        }
    });

    if (!conversation) notFound();

    // Fetch messages separately to order them
    const chatMessages = await db.query.messages.findMany({
        where: eq(messages.conversationId, id),
        orderBy: [asc(messages.createdAt)],
    });

    const otherUser = conversation.buyerId === currentUserId ? conversation.seller : conversation.buyer;

    return (
        <div className="container max-w-2xl py-10 h-[calc(100vh-4rem)] flex flex-col">
            <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b py-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold">{otherUser.name}</h2>
                            <p className="text-xs text-muted-foreground">
                                {conversation.type === "job"
                                    ? conversation.job?.title
                                    : conversation.listing?.title}
                            </p>
                        </div>
                    </div>
                    <ChatContextCard
                        type={conversation.type}
                        listing={conversation.listing ? {
                            id: conversation.listing.id,
                            title: conversation.listing.title,
                            price: conversation.listing.price,
                            currency: conversation.listing.currency,
                        } : null}
                        job={conversation.job ? {
                            id: conversation.job.id,
                            title: conversation.job.title,
                        } : null}
                    />
                </CardHeader>
                <ChatMessages
                    conversationId={id}
                    currentUserId={currentUserId}
                    initialMessages={chatMessages}
                />
            </Card>
        </div>
    );
}
