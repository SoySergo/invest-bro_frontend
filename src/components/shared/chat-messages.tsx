"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Clock, Send } from "lucide-react";
import { sendMessage, markMessagesRead } from "@/lib/actions/chat";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  readAt: Date | null;
}

interface ChatMessagesProps {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}

function MessageStatusIcon({ status, isMe }: { status: string; isMe: boolean }) {
  if (!isMe) return null;

  switch (status) {
    case "read":
      return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
    case "delivered":
      return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
    case "sent":
    default:
      return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

export function ChatMessages({ conversationId, currentUserId, initialMessages }: ChatMessagesProps) {
  const t = useTranslations("Chat");
  const [chatMessages, setMessages] = React.useState<Message[]>(initialMessages);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Mark messages as read on mount and when new messages come in
  React.useEffect(() => {
    const unreadFromOthers = chatMessages.some(
      (m) => m.senderId !== currentUserId && m.status !== "read"
    );
    if (unreadFromOthers) {
      markMessagesRead(conversationId);
    }
  }, [chatMessages, conversationId, currentUserId]);

  // SSE for real-time messages
  React.useEffect(() => {
    const eventSource = new EventSource(
      `/api/chat/stream?conversationId=${conversationId}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_messages" && data.messages) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMessages = data.messages.filter(
              (m: Message) => !existingIds.has(m.id)
            );
            if (newMessages.length === 0) return prev;
            return [...prev, ...newMessages].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          // Mark new messages from others as read
          markMessagesRead(conversationId);
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
  }, [conversationId]);

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get("content") as string;
    if (!content?.trim()) return;

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      content: content.trim(),
      status: "sent",
      createdAt: new Date(),
      readAt: null,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    formRef.current?.reset();

    await sendMessage(conversationId, formData);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {chatMessages.length === 0 && (
          <div className="text-center text-muted-foreground my-auto">
            {t("startChat")}
          </div>
        )}
        {chatMessages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  isMe
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  <span className={`text-[10px] ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatTime(msg.createdAt)}
                  </span>
                  <MessageStatusIcon status={msg.status} isMe={isMe} />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <form ref={formRef} action={handleSubmit} className="flex w-full gap-2">
          <Input
            name="content"
            placeholder={t("typePlaceholder")}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">{t("send")}</span>
          </Button>
        </form>
      </div>
    </>
  );
}
