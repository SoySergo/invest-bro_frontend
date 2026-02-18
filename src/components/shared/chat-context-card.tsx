"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Store, TrendingUp, Briefcase } from "lucide-react";

interface ChatContextCardProps {
  type: "listing" | "investment" | "job";
  listing?: {
    id: string;
    title: string;
    price: string;
    currency: string;
  } | null;
  job?: {
    id: string;
    title: string;
  } | null;
}

const typeIcons = {
  listing: Store,
  investment: TrendingUp,
  job: Briefcase,
} as const;

const typeColors = {
  listing: "bg-primary/10 text-primary border-primary/20",
  investment: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  job: "bg-amber-500/10 text-amber-500 border-amber-500/20",
} as const;

export function ChatContextCard({ type, listing, job }: ChatContextCardProps) {
  const t = useTranslations("Chat");
  const Icon = typeIcons[type];

  if (type === "listing" && listing) {
    return (
      <Link href={`/listing/${listing.id}`}>
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm hover:bg-muted/80 transition-colors">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium">{listing.title}</span>
          <Badge variant="outline" className={typeColors[type]}>
            {t("typeListing")}
          </Badge>
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
            {new Intl.NumberFormat("en", {
              style: "currency",
              currency: listing.currency || "EUR",
              maximumFractionDigits: 0,
            }).format(Number(listing.price))}
          </span>
        </div>
      </Link>
    );
  }

  if (type === "investment" && listing) {
    return (
      <Link href={`/listing/${listing.id}`}>
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm hover:bg-muted/80 transition-colors">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium">{listing.title}</span>
          <Badge variant="outline" className={typeColors[type]}>
            {t("typeInvestment")}
          </Badge>
        </div>
      </Link>
    );
  }

  if (type === "job" && job) {
    return (
      <Link href={`/job/${job.id}`}>
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm hover:bg-muted/80 transition-colors">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium">{job.title}</span>
          <Badge variant="outline" className={typeColors[type]}>
            {t("typeJob")}
          </Badge>
        </div>
      </Link>
    );
  }

  if (type === "investment") {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Badge variant="outline" className={typeColors[type]}>
          {t("typeInvestment")}
        </Badge>
      </div>
    );
  }

  return null;
}
