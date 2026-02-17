import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
import { MainNav } from "@/components/main-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";

// Mock user for MVP - get first user
const getMockUserId = async () => {
    const u = await db.query.users.findFirst();
    return u?.id; 
};

export default async function ChatListPage() {
  const currentUserId = await getMockUserId();
  if (!currentUserId) return <div>Please login first</div>;

  const userConversations = await db.query.conversations.findMany({
    where: or(
      eq(conversations.buyerId, currentUserId),
      eq(conversations.sellerId, currentUserId)
    ),
    with: {
        listing: true,
        buyer: true,
        seller: true,
        messages: {
            limit: 1,
            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
        }
    },
    orderBy: (conversations, { desc }) => [desc(conversations.lastMessageAt)],
  });

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="space-y-4">
        {userConversations.map((conv) => {
            const otherUser = conv.buyerId === currentUserId ? conv.seller : conv.buyer;
            const lastMsg = conv.messages[0]?.content || "No messages yet";
            
            return (
                <Link href={`/chat/${conv.id}`} key={conv.id}>
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4 flex items-center gap-4">
                             <Avatar>
                                <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                             </Avatar>
                             <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-semibold truncate">{otherUser.name}</h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                    <span className="font-medium text-foreground mr-2">
                                        {conv.listing?.title}:
                                    </span>
                                    {lastMsg}
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </Link>
            );
        })}
        {userConversations.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                No conversation yet.
             </div>
        )}
      </div>
    </div>
  );
}
