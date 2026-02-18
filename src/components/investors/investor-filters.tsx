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
import { INVESTOR_TYPES, INVESTOR_STAGES, INVESTOR_INDUSTRIES, PARTICIPATION_TYPES } from "@/lib/schemas/investor";

interface InvestorFiltersProps {
  defaultType?: string;
  defaultStage?: string;
  defaultIndustry?: string;
  defaultParticipationType?: string;
}

export function InvestorFilters({
  defaultType = "",
  defaultStage = "",
  defaultIndustry = "",
  defaultParticipationType = "",
}: InvestorFiltersProps) {
  const t = useTranslations("Investors");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState(defaultType);
  const [stage, setStage] = useState(defaultStage);
  const [industry, setIndustry] = useState(defaultIndustry);
  const [participationType, setParticipationType] = useState(defaultParticipationType);

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
    setType("");
    setStage("");
    setIndustry("");
    setParticipationType("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = type || stage || industry || participationType;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Type Filter */}
        <Select
          value={type}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setType(v);
            updateFilters({ type: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-44 bg-surface-2/50">
            <SelectValue placeholder={t("allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            {INVESTOR_TYPES.map((investorType) => (
              <SelectItem key={investorType} value={investorType}>
                {t(`types.${investorType}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stage Filter */}
        <Select
          value={stage}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setStage(v);
            updateFilters({ stage: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-44 bg-surface-2/50">
            <SelectValue placeholder={t("allStages")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStages")}</SelectItem>
            {INVESTOR_STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`stages.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Industry Filter */}
        <Select
          value={industry}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setIndustry(v);
            updateFilters({ industry: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-44 bg-surface-2/50">
            <SelectValue placeholder={t("allIndustries")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allIndustries")}</SelectItem>
            {INVESTOR_INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {t(`industries.${ind}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Participation Type Filter */}
        <Select
          value={participationType}
          onValueChange={(value) => {
            const v = value === "all" ? "" : value;
            setParticipationType(v);
            updateFilters({ participationType: v });
          }}
        >
          <SelectTrigger className="w-full sm:w-44 bg-surface-2/50">
            <SelectValue placeholder={t("allParticipation")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allParticipation")}</SelectItem>
            {PARTICIPATION_TYPES.map((pt) => (
              <SelectItem key={pt} value={pt}>
                {t(`participation.${pt}`)}
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
          {t("loading")}
        </div>
      )}
    </div>
  );
}
