"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatSearchProps {
  onSearch: (query: string) => void;
}

export function ChatSearch({ onSearch }: ChatSearchProps) {
  const t = useTranslations("Chat");
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">{t("searchMessages")}</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={t("searchMessages")}
        className="h-8 w-48"
        autoFocus
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          setIsOpen(false);
          setQuery("");
          onSearch("");
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
