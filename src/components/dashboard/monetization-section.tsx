"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Crown, CheckCircle } from "lucide-react";
import { promoteListing, subscribePremium } from "@/lib/actions/dashboard";
import { toast } from "sonner";
import type { ListingStats } from "@/lib/data/dashboard";

interface MonetizationSectionProps {
  listings: ListingStats[];
  hasPremium: boolean;
}

export function MonetizationSection({ listings, hasPremium }: MonetizationSectionProps) {
  const t = useTranslations("Dashboard");
  const [loadingPromo, setLoadingPromo] = useState<string | null>(null);
  const [loadingPremium, setLoadingPremium] = useState(false);

  const activeListings = listings.filter(
    (l) => l.status === "active" && !l.isPromoted
  );

  async function handlePromote(listingId: string, duration: "7" | "14" | "30") {
    setLoadingPromo(listingId);
    const result = await promoteListing(listingId, duration);
    setLoadingPromo(null);
    if (result.success) {
      toast.success(t("promoteSuccess"));
    } else {
      toast.error(result.error);
    }
  }

  async function handleSubscribe() {
    setLoadingPremium(true);
    const result = await subscribePremium();
    setLoadingPremium(false);
    if (result.success) {
      toast.success(t("premiumSuccess"));
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      {/* Premium Subscription */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            {t("premiumTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasPremium ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              {t("premiumActive")}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("premiumDescription")}
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {t("premiumFeature1")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {t("premiumFeature2")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {t("premiumFeature3")}
                </li>
              </ul>
              <Button
                onClick={handleSubscribe}
                disabled={loadingPremium}
                className="bg-linear-to-r from-amber-500 to-amber-600"
              >
                <Crown className="mr-2 h-4 w-4" />
                {loadingPremium ? t("processing") : t("subscribePremium")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promote Listings */}
      {activeListings.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              {t("promoteTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("promoteDescription")}
            </p>
            {activeListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-sm">{listing.title}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {(["7", "14", "30"] as const).map((days) => (
                    <Button
                      key={days}
                      variant="outline"
                      size="sm"
                      disabled={loadingPromo === listing.id}
                      onClick={() => handlePromote(listing.id, days)}
                    >
                      {days}d
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
