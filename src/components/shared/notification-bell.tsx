"use client";

import * as React from "react";
import { Bell, MessageCircle, Heart, Briefcase, MessageSquare, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/i18n/routing";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";

interface Notification {
  id: string;
  type: "new_message" | "job_application" | "favorite_added" | "chat_invitation";
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationBellProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

const notificationIcons = {
  new_message: MessageCircle,
  job_application: Briefcase,
  favorite_added: Heart,
  chat_invitation: MessageSquare,
} as const;

export function NotificationBell({ initialNotifications, initialUnreadCount }: NotificationBellProps) {
  const t = useTranslations("Notifications");
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [unreadCount, setUnreadCount] = React.useState(initialUnreadCount);

  React.useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "update" || data.type === "init") {
          setUnreadCount(data.unreadCount);
          if (data.latest) {
            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const newOnes = data.latest.filter(
                (n: Notification) => !existingIds.has(n.id)
              );
              if (newOnes.length === 0) return prev;
              return [...newOnes, ...prev].slice(0, 20);
            });
          }
        }
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("justNow");
    if (minutes < 60) return t("minutesAgo", { count: minutes });
    if (hours < 24) return t("hoursAgo", { count: hours });
    return t("daysAgo", { count: days });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">{t("title")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3">
          <h3 className="text-sm font-semibold">{t("title")}</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={handleMarkAllRead}
            >
              <Check className="mr-1 h-3 w-3" />
              {t("markAllRead")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("empty")}
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              return (
                <DropdownMenuItem key={notification.id} asChild className="cursor-pointer p-0">
                  <div
                    className={`flex gap-3 p-3 ${!notification.isRead ? "bg-primary/5" : ""}`}
                    onClick={() => {
                      if (!notification.isRead) handleMarkRead(notification.id);
                    }}
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {notification.link ? (
                        <Link href={notification.link} className="block">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          {notification.body && (
                            <p className="text-xs text-muted-foreground truncate">{notification.body}</p>
                          )}
                        </Link>
                      ) : (
                        <>
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          {notification.body && (
                            <p className="text-xs text-muted-foreground truncate">{notification.body}</p>
                          )}
                        </>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
