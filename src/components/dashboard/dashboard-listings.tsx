"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Pencil, Zap } from "lucide-react";
import type { ListingStats } from "@/lib/data/dashboard";

interface DashboardListingsProps {
  listings: ListingStats[];
}

export function DashboardListings({ listings }: DashboardListingsProps) {
  const t = useTranslations("Dashboard");
  const tNav = useTranslations("Navigation");

  if (listings.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t("myListings")}</CardTitle>
          <Link href="/listing/create">
            <Button size="sm">{tNav("create")}</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("noListings")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t("myListings")}</CardTitle>
        <Link href="/listing/create">
          <Button size="sm">{tNav("create")}</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors"
            >
              <Link
                href={`/listing/${listing.id}`}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{listing.title}</p>
                  {listing.isPromoted && (
                    <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  €{Number(listing.price).toLocaleString()}
                </p>
              </Link>
              <div className="flex items-center gap-3 ml-3">
                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {listing.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {listing.favoriteCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {listing.contactCount}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    listing.status === "active"
                      ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                      : listing.status === "draft"
                        ? "border-amber-500/50 text-amber-600 dark:text-amber-400"
                        : listing.status === "sold"
                          ? "border-blue-500/50 text-blue-600 dark:text-blue-400"
                          : "border-muted-foreground/50"
                  }
                >
                  {listing.status}
                </Badge>
                <Link href={`/listing/${listing.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
