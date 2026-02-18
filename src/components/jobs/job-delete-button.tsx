"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteJob } from "@/lib/actions/jobs";

interface JobDeleteButtonProps {
  jobId: string;
}

export function JobDeleteButton({ jobId }: JobDeleteButtonProps) {
  const t = useTranslations("JobDetail");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(t("confirmDelete"))) return;

    startTransition(async () => {
      const result = await deleteJob(jobId);
      if (result.success) {
        toast.success(t("deleted"));
        router.push("/jobs");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 mr-1" />
      )}
      {t("delete")}
    </Button>
  );
}
