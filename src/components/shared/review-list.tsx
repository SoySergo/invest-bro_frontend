"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";
import { useTranslations, useLocale } from "next-intl";

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  fromUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  listing?: {
    id: string;
    title: string;
  } | null;
}

interface ReviewListProps {
  reviews: ReviewData[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const t = useTranslations("Trust");
  const locale = useLocale();

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 rounded-xl border border-border/50 bg-surface-2/20 space-y-2"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={review.fromUser.image ?? undefined} />
              <AvatarFallback className="text-xs">
                {review.fromUser.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{review.fromUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString(locale)}
              </p>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground pl-11">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
