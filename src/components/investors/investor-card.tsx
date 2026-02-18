"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, MapPin, Briefcase, Target, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/constants/countries";

interface InvestorCardData {
  id: string;
  type: string;
  stages: string[] | null;
  industries: string[] | null;
  ticketMin: string | null;
  ticketMax: string | null;
  currency: string;
  participationType: string | null;
  geoFocus: string[] | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    company: string | null;
    country: string | null;
    city: string | null;
  };
}

export function InvestorCard({ investor }: { investor: InvestorCardData }) {
  const t = useTranslations("InvestorCard");
  const tInvestors = useTranslations("Investors");
  const tCountries = useTranslations("Countries");
  const locale = useLocale();

  const ticketRange = (() => {
    const min = Number(investor.ticketMin) || 0;
    const max = Number(investor.ticketMax) || 0;
    if (min > 0 && max > 0) {
      return `${formatPrice(min, investor.currency, locale)} — ${formatPrice(max, investor.currency, locale)}`;
    }
    if (min > 0) return `${t("from")} ${formatPrice(min, investor.currency, locale)}`;
    if (max > 0) return `${t("upTo")} ${formatPrice(max, investor.currency, locale)}`;
    return null;
  })();

  const stages = (investor.stages as string[]) || [];
  const industries = (investor.industries as string[]) || [];
  const geoFocus = (investor.geoFocus as string[]) || [];

  return (
    <Card className="overflow-hidden glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarImage src={investor.user.image ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
              {investor.user.name?.charAt(0)?.toUpperCase() ?? "I"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
              {investor.user.name || t("anonymous")}
            </h3>
            {investor.user.company && (
              <p className="text-sm text-muted-foreground truncate">{investor.user.company}</p>
            )}
            <Badge variant="secondary" className="mt-1 capitalize bg-primary/10 text-primary border-0 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {tInvestors(`types.${investor.type}`)}
            </Badge>
          </div>
        </div>

        {ticketRange && (
          <div className="mb-3 p-3 bg-surface-2/30 rounded-xl border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">{t("investmentTicket")}</p>
            <p className="text-sm font-semibold text-primary">{ticketRange}</p>
          </div>
        )}

        {stages.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Target className="h-3 w-3" />
              {t("stages")}
            </p>
            <div className="flex flex-wrap gap-1">
              {stages.slice(0, 3).map((stage) => (
                <Badge key={stage} variant="outline" className="text-xs capitalize">
                  {tInvestors(`stages.${stage}`)}
                </Badge>
              ))}
              {stages.length > 3 && (
                <Badge variant="outline" className="text-xs">+{stages.length - 3}</Badge>
              )}
            </div>
          </div>
        )}

        {industries.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {t("industries")}
            </p>
            <div className="flex flex-wrap gap-1">
              {industries.slice(0, 3).map((industry) => (
                <Badge key={industry} variant="outline" className="text-xs capitalize bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  {tInvestors(`industries.${industry}`)}
                </Badge>
              ))}
              {industries.length > 3 && (
                <Badge variant="outline" className="text-xs">+{industries.length - 3}</Badge>
              )}
            </div>
          </div>
        )}

        {(investor.user.country || geoFocus.length > 0) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {investor.user.country ? (
              <span>
                {investor.user.city ? `${investor.user.city}, ` : ""}
                {tCountries(investor.user.country)}
              </span>
            ) : (
              <span>{geoFocus.slice(0, 3).map((c) => tCountries(c)).join(", ")}</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/investor/${investor.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            {t("viewProfile")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
