"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalViews: number;
  totalFavorites: number;
  totalContacts: number;
  listingsCount: number;
}

export function DashboardStats({
  totalViews,
  totalFavorites,
  totalContacts,
  listingsCount,
}: DashboardStatsProps) {
  const t = useTranslations("Dashboard");

  const stats = [
    {
      label: t("totalViews"),
      value: totalViews,
      icon: Eye,
      color: "text-primary",
    },
    {
      label: t("totalFavorites"),
      value: totalFavorites,
      icon: Heart,
      color: "text-rose-500",
    },
    {
      label: t("totalContacts"),
      value: totalContacts,
      icon: MessageCircle,
      color: "text-emerald-500",
    },
    {
      label: t("activeListings"),
      value: listingsCount,
      icon: TrendingUp,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
