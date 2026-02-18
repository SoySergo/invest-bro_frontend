"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { applyToJob } from "@/lib/actions/jobs";
import { Link } from "@/i18n/routing";

interface JobApplyButtonProps {
  jobId: string;
  hasApplied: boolean;
  isAuthenticated: boolean;
}

export function JobApplyButton({ jobId, hasApplied, isAuthenticated }: JobApplyButtonProps) {
  const t = useTranslations("JobDetail");
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="w-full">
        <Button className="w-full text-base py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" size="lg">
          {t("loginToApply")}
        </Button>
      </Link>
    );
  }

  if (hasApplied) {
    return (
      <Button className="w-full text-base py-6" size="lg" disabled>
        <Check className="h-5 w-5 mr-2" />
        {t("alreadyApplied")}
      </Button>
    );
  }

  const handleApply = () => {
    startTransition(async () => {
      const result = await applyToJob({ jobId });
      if (result.success) {
        toast.success(t("applicationSent"));
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button
      className="w-full text-base py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
      size="lg"
      onClick={handleApply}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      ) : (
        <Send className="h-5 w-5 mr-2" />
      )}
      {t("applyNow")}
    </Button>
  );
}
