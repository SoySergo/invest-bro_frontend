"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState, useTransition, useCallback } from "react";

const categories = [
  "restaurant",
  "retail",
  "service",
  "hotel",
  "beauty",
  "automotive",
  "gym",
  "saas",
  "ecommerce",
  "content",
  "app",
  "marketplace",
  "agency",
];

interface ListingFiltersProps {
  defaultSearch?: string;
  defaultType?: string;
  defaultCategory?: string;
}

export function ListingFilters({
  defaultSearch = "",
  defaultType = "",
  defaultCategory = "",
}: ListingFiltersProps) {
  const t = useTranslations("Listings");
  const tCat = useTranslations("Categories");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(defaultSearch);
  const [type, setType] = useState(defaultType);
  const [category, setCategory] = useState(defaultCategory);

  const updateFilters = useCallback(
    (newFilters: { search?: string; type?: string; category?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.search !== undefined) {
        if (newFilters.search) params.set("search", newFilters.search);
        else params.delete("search");
      }
      if (newFilters.type !== undefined) {
        if (newFilters.type) params.set("type", newFilters.type);
        else params.delete("type");
      }
      if (newFilters.category !== undefined) {
        if (newFilters.category) params.set("category", newFilters.category);
        else params.delete("category");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = () => {
    setSearch("");
    setType("");
    setCategory("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = search || type || category;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters({ search });
              }
            }}
            onBlur={() => {
              if (search !== defaultSearch) {
                updateFilters({ search });
              }
            }}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value === "all" ? "" : value);
            updateFilters({ type: value === "all" ? "" : value });
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            <SelectItem value="online">{t("online")}</SelectItem>
            <SelectItem value="offline">{t("offline")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value === "all" ? "" : value);
            updateFilters({ category: value === "all" ? "" : value });
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {tCat(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isPending && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
}
