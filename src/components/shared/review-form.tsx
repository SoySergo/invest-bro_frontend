"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/shared/star-rating";
import { submitReview } from "@/lib/actions/reviews";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { MessageSquarePlus } from "lucide-react";

interface ReviewFormProps {
  toUserId: string;
  listingId?: string;
}

export function ReviewForm({ toUserId, listingId }: ReviewFormProps) {
  const t = useTranslations("Trust");
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(t("ratingRequired"));
      return;
    }

    startTransition(async () => {
      const result = await submitReview({
        toUserId,
        listingId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (result.success) {
        toast.success(t("reviewSubmitted"));
        setOpen(false);
        setRating(0);
        setComment("");
      } else {
        toast.error(result.error || t("reviewError"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          {t("writeReview")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("writeReview")}</DialogTitle>
          <DialogDescription>{t("reviewDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>{t("rating")}</Label>
            <StarRating
              rating={rating}
              interactive
              onChange={setRating}
              size="lg"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="comment">{t("comment")}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              className="mt-2"
              rows={4}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending || rating === 0} className="w-full">
            {isPending ? t("submitting") : t("submitReview")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
