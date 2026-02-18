"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState, useTransition, useCallback } from "react";
import { ROLE_CATEGORIES, JOB_LEVELS, EMPLOYMENT_TYPES } from "@/lib/schemas/job";

interface JobFiltersProps {
  defaultRoleCategory?: string;
  defaultLevel?: string;
  defaultEmploymentType?: string;
  defaultHasEquity?: string;
  defaultUrgency?: string;
}

export function JobFilters({
  defaultRoleCategory = "",
  defaultLevel = "",
  defaultEmploymentType = "",
  defaultHasEquity = "",
  defaultUrgency = "",
}: JobFiltersProps) {
  const t = useTranslations("Jobs");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [roleCategory, setRoleCategory] = useState(defaultRoleCategory);
  const [level, setLevel] = useState(defaultLevel);
  const [employmentType, setEmploymentType] = useState(defaultEmploymentType);
  const [hasEquity, setHasEquity] = useState(defaultHasEquity);
  const [urgency, setUrgency] = useState(defaultUrgency);

  const updateFilters = useCallback(
    (newFilters: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(newFilters)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = () => {
    setRoleCategory("");
    setLevel("");
    setEmploymentType("");
    setHasEquity("");
    setUrgency("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = roleCategory || level || employmentType || hasEquity || urgency;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Role Category Filter */}
        <Select
          value={roleCategory}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setRoleCategory(v);
            updateFilters({ roleCategory: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-48 bg-surface-2/50">
            <SelectValue placeholder={t("allRoles")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allRoles")}</SelectItem>
            {ROLE_CATEGORIES.map((role) => (
              <SelectItem key={role} value={role}>
                {t(`roles.${role}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select
          value={level}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setLevel(v);
            updateFilters({ level: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-40 bg-surface-2/50">
            <SelectValue placeholder={t("allLevels")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allLevels")}</SelectItem>
            {JOB_LEVELS.map((l) => (
              <SelectItem key={l} value={l}>
                {t(`levels.${l}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Employment Type Filter */}
        <Select
          value={employmentType}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setEmploymentType(v);
            updateFilters({ employmentType: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-40 bg-surface-2/50">
            <SelectValue placeholder={t("allFormats")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allFormats")}</SelectItem>
            {EMPLOYMENT_TYPES.map((et) => (
              <SelectItem key={et} value={et}>
                {t(`employment.${et}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Equity Filter */}
        <Select
          value={hasEquity}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setHasEquity(v);
            updateFilters({ hasEquity: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-40 bg-surface-2/50">
            <SelectValue placeholder={t("equityFilter")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("equityFilter")}</SelectItem>
            <SelectItem value="true">{t("withEquityOnly")}</SelectItem>
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
          {t("loading")}
        </div>
      )}
    </div>
  );
}
