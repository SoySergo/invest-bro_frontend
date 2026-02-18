"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requestVerification } from "@/lib/actions/verification";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ShieldCheck, Clock, XCircle } from "lucide-react";

interface VerificationRequestProps {
  currentStatus: string;
}

export function VerificationRequest({ currentStatus }: VerificationRequestProps) {
  const t = useTranslations("Trust");
  const [isPending, startTransition] = useTransition();

  const handleRequest = () => {
    startTransition(async () => {
      const result = await requestVerification();
      if (result.success) {
        toast.success(t("verificationRequested"));
      } else {
        toast.error(result.error || t("verificationError"));
      }
    });
  };

  if (currentStatus === "verified") {
    return (
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
        {t("verified")}
      </Badge>
    );
  }

  if (currentStatus === "pending") {
    return (
      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
        <Clock className="h-3.5 w-3.5 mr-1" />
        {t("verificationPending")}
      </Badge>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="h-3.5 w-3.5 mr-1" />
          {t("verificationRejected")}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleRequest} disabled={isPending}>
          {t("retryVerification")}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleRequest} disabled={isPending}>
      <ShieldCheck className="h-4 w-4 mr-2" />
      {isPending ? t("submitting") : t("requestVerification")}
    </Button>
  );
}
