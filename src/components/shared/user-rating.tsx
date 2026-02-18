import { StarRating } from "@/components/shared/star-rating";
import { useTranslations } from "next-intl";

interface UserRatingProps {
  averageRating: number;
  totalReviews: number;
  className?: string;
}

export function UserRating({ averageRating, totalReviews, className }: UserRatingProps) {
  const t = useTranslations("Trust");

  if (totalReviews === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <StarRating rating={averageRating} size="sm" />
        <span className="text-sm font-medium">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          ({totalReviews} {totalReviews === 1 ? t("review") : t("reviews")})
        </span>
      </div>
    </div>
  );
}
