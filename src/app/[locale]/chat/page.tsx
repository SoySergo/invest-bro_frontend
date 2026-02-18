import { db } from "@/db";
import { conversations, messages } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { Store, TrendingUp, Briefcase } from "lucide-react";

const typeIcons = {
  listing: Store,
  investment: TrendingUp,
  job: Briefcase,
} as const;

const typeBadgeColors = {
  listing: "bg-primary/10 text-primary border-primary/20",
  investment: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  job: "bg-amber-500/10 text-amber-500 border-amber-500/20",
} as const;

export default async function ChatListPage() {
  const t = await getTranslations("Chat");
  const session = await auth();
  const currentUserId = session?.user?.id;
  if (!currentUserId) return <div>{t("pleaseLogin")}</div>;

  const userConversations = await db.query.conversations.findMany({
    where: or(
      eq(conversations.buyerId, currentUserId),
      eq(conversations.sellerId, currentUserId)
    ),
    with: {
      listing: true,
      job: true,
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
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <div className="space-y-4">
        {userConversations.map((conv) => {
          const otherUser = conv.buyerId === currentUserId ? conv.seller : conv.buyer;
          const lastMsg = conv.messages[0]?.content || t("noMessagesYet");
          const unreadCount = conv.messages.filter(
            (m) => m.senderId !== currentUserId && m.status === "sent"
          ).length;
          const Icon = typeIcons[conv.type];
          const contextTitle = conv.type === "job" ? conv.job?.title : conv.listing?.title;

          return (
            <Link href={`/chat/${conv.id}`} key={conv.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{otherUser.name}</h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${typeBadgeColors[conv.type]}`}
                        >
                          <Icon className="h-3 w-3 mr-0.5" />
                          {t(`type${conv.type.charAt(0).toUpperCase() + conv.type.slice(1)}`)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
                            {unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {contextTitle && (
                        <span className="font-medium text-foreground mr-2">
                          {contextTitle}:
                        </span>
                      )}
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
            {t("noConversations")}
          </div>
        )}
      </div>
    </div>
  );
}
