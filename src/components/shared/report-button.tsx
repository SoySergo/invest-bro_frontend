"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitReport } from "@/lib/actions/reports";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Flag } from "lucide-react";

interface ReportButtonProps {
  reportedUserId?: string;
  listingId?: string;
  variant?: "icon" | "button";
}

const REPORT_REASONS = ["spam", "fraud", "inappropriate", "duplicate", "misleading", "other"] as const;

export function ReportButton({ reportedUserId, listingId, variant = "button" }: ReportButtonProps) {
  const t = useTranslations("Trust");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!reason) {
      toast.error(t("reasonRequired"));
      return;
    }

    startTransition(async () => {
      const result = await submitReport({
        reportedUserId,
        listingId,
        reason,
        description: description.trim() || undefined,
      });

      if (result.success) {
        toast.success(t("reportSubmitted"));
        setOpen(false);
        setReason("");
        setDescription("");
      } else {
        toast.error(result.error || t("reportError"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <button className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Flag className="h-4 w-4" />
          </button>
        ) : (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <Flag className="h-4 w-4 mr-2" />
            {t("report")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reportTitle")}</DialogTitle>
          <DialogDescription>{t("reportDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>{t("reason")}</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t("selectReason")} />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`reasons.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              className="mt-2"
              rows={4}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending || !reason} variant="destructive" className="w-full">
            {isPending ? t("submitting") : t("submitReport")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
