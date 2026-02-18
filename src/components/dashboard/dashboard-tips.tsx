"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Camera, TrendingUp, Star } from "lucide-react";
import type { ListingStats } from "@/lib/data/dashboard";

interface DashboardTipsProps {
  listings: ListingStats[];
}

export function DashboardTips({ listings }: DashboardTipsProps) {
  const t = useTranslations("Dashboard");

  const tips: Array<{ icon: typeof Lightbulb; text: string; show: boolean }> = [
    {
      icon: Camera,
      text: t("tipAddPhotos"),
      show: listings.some((l) => !l.hasImages && l.status === "active"),
    },
    {
      icon: TrendingUp,
      text: t("tipPromote"),
      show: listings.some((l) => !l.isPromoted && l.status === "active"),
    },
    {
      icon: Star,
      text: t("tipComplete"),
      show: listings.some((l) => l.status === "draft"),
    },
  ];

  const visibleTips = tips.filter((tip) => tip.show);

  if (visibleTips.length === 0) return null;

  return (
    <Card className="border-border/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          {t("tips")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visibleTips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <tip.icon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
            <span>{tip.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
