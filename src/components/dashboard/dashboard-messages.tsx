"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface RecentMessage {
  id: string;
  content: string;
  senderName: string | null;
  createdAt: Date;
  conversationId: string;
}

interface DashboardMessagesProps {
  messages: RecentMessage[];
}

export function DashboardMessages({ messages }: DashboardMessagesProps) {
  const t = useTranslations("Dashboard");

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t("recentMessages")}</CardTitle>
        <Link
          href="/chat"
          className="text-sm text-primary hover:underline"
        >
          {t("viewAll")}
        </Link>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noMessages")}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <Link
                key={msg.id}
                href={`/chat/${msg.conversationId}`}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors"
              >
                <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {msg.senderName ?? t("unknownUser")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {msg.content}
                  </p>
                </div>
                <time className="text-xs text-muted-foreground shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </time>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
