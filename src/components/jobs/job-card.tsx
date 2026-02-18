"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Coins, ArrowRight, Zap, Award, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice } from "@/lib/constants/countries";

interface JobCardData {
  id: string;
  title: string;
  roleCategory: string;
  level: string;
  employmentType: string[] | null;
  country: string | null;
  city: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  currency: string;
  hasEquity: boolean;
  urgency: string;
  experienceYears: number | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    company: string | null;
  };
  listing: {
    id: string;
    title: string;
  } | null;
}

function getSpecialFormatBadge(roleCategory: string, hasEquity: boolean, employmentType: string[] | null) {
  if (roleCategory === "co-founder") return { label: "coFounder", icon: Users, color: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25" };
  if (roleCategory === "intern" || employmentType?.includes("internship")) return { label: "internship", icon: Award, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25" };
  if (roleCategory === "fractional-cxo") return { label: "fractionalCXO", icon: Zap, color: "bg-primary/15 text-primary border-primary/25" };
  if (roleCategory === "adviser") return { label: "advisory", icon: Award, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25" };
  if (hasEquity) return { label: "withEquity", icon: Coins, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25" };
  return null;
}

export function JobCard({ job }: { job: JobCardData }) {
  const t = useTranslations("JobCard");
  const tJobs = useTranslations("Jobs");
  const tCountries = useTranslations("Countries");
  const locale = useLocale();

  const salaryRange = (() => {
    const min = Number(job.salaryMin) || 0;
    const max = Number(job.salaryMax) || 0;
    if (min > 0 && max > 0) {
      return `${formatPrice(min, job.currency, locale)} — ${formatPrice(max, job.currency, locale)}`;
    }
    if (min > 0) return `${t("from")} ${formatPrice(min, job.currency, locale)}`;
    if (max > 0) return `${t("upTo")} ${formatPrice(max, job.currency, locale)}`;
    return null;
  })();

  const employmentTypes = (job.employmentType as string[]) || [];
  const specialFormat = getSpecialFormatBadge(job.roleCategory, job.hasEquity, employmentTypes);

  return (
    <Card className="overflow-hidden glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            {(job.user.company || job.listing) && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {job.user.company || job.listing?.title}
              </p>
            )}
          </div>
          {job.urgency === "asap" && (
            <Badge variant="destructive" className="shrink-0 text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {tJobs(`urgency.${job.urgency}`)}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className="capitalize text-xs bg-primary/10 text-primary border-0">
            <Briefcase className="h-3 w-3 mr-1" />
            {tJobs(`roles.${job.roleCategory}`)}
          </Badge>
          <Badge variant="outline" className="capitalize text-xs">
            {tJobs(`levels.${job.level}`)}
          </Badge>
          {specialFormat && (
            <Badge variant="outline" className={`text-xs ${specialFormat.color}`}>
              <specialFormat.icon className="h-3 w-3 mr-1" />
              {t(specialFormat.label)}
            </Badge>
          )}
        </div>

        {employmentTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {employmentTypes.slice(0, 3).map((type) => (
              <Badge key={type} variant="outline" className="text-xs capitalize">
                {tJobs(`employment.${type}`)}
              </Badge>
            ))}
            {employmentTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">+{employmentTypes.length - 3}</Badge>
            )}
          </div>
        )}

        {salaryRange && (
          <div className="mb-3 p-3 bg-surface-2/30 rounded-xl border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">{t("salary")}</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{salaryRange}</p>
            {job.hasEquity && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">+ {t("equity")}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {(job.country || job.city) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.city ? `${job.city}, ` : ""}
              {job.country ? tCountries(job.country) : ""}
            </span>
          )}
          {!job.country && employmentTypes.includes("remote") && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {t("remote")}
            </span>
          )}
          {job.experienceYears != null && job.experienceYears > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.experienceYears}+ {t("years")}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/job/${job.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            {t("viewDetails")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
