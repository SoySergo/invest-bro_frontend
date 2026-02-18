import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { sendMessage } from "@/lib/actions/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

// Mock user
const getMockUserId = async () => {
    const u = await db.query.users.findFirst();
    return u?.id;
};

export default async function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const t = await getTranslations("Chat");
    const currentUserId = await getMockUserId();

    if (!currentUserId) return <div>{t("pleaseLogin")}</div>;

    const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, id),
        with: {
            buyer: true,
            seller: true,
            listing: true,
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
                <CardHeader className="border-b py-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold">{otherUser.name}</h2>
                            <p className="text-xs text-muted-foreground">{conversation.listing?.title}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                    {chatMessages.length === 0 && (
                        <div className="text-center text-muted-foreground my-auto">
                            {t("startChat")}
                        </div>
                    )}
                    {chatMessages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
                <CardFooter className="border-t p-4">
                    <form action={sendMessage.bind(null, id)} className="flex w-full gap-2">
                        <Input name="content" placeholder={t("typePlaceholder")} className="flex-1" autoComplete="off" />
                        <Button type="submit">{t("send")}</Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
