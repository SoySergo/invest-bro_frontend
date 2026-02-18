"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, MoreVertical, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter as useI18nRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { deleteListing, changeListingStatus } from "@/lib/actions/listings";
import { toast } from "sonner";

interface ListingOwnerActionsProps {
  listingId: string;
  currentStatus: string;
}

export function ListingOwnerActions({ listingId, currentStatus }: ListingOwnerActionsProps) {
  const t = useTranslations("ListingManage");
  const tCommon = useTranslations("Common");
  const router = useI18nRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    router.push(`/listing/${listingId}/edit`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteListing(listingId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t("deleteSuccess"));
        router.push("/listings");
      }
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleStatusChange = async (status: "active" | "draft" | "sold" | "hidden") => {
    setLoading(true);
    try {
      const res = await changeListingStatus(listingId, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t("statusUpdated"));
      }
    } catch {
      toast.error(t("statusError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="h-4 w-4 mr-1.5" />
          {tCommon("edit")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={loading}>
              <span className="text-xs text-muted-foreground">{t("statusChange")}</span>
            </DropdownMenuItem>
            {currentStatus !== "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange("active")} disabled={loading}>
                <Eye className="h-4 w-4 mr-2" />
                {t("statusActive")}
              </DropdownMenuItem>
            )}
            {currentStatus !== "draft" && (
              <DropdownMenuItem onClick={() => handleStatusChange("draft")} disabled={loading}>
                <EyeOff className="h-4 w-4 mr-2" />
                {t("statusDraft")}
              </DropdownMenuItem>
            )}
            {currentStatus !== "sold" && (
              <DropdownMenuItem onClick={() => handleStatusChange("sold")} disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t("statusSold")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {tCommon("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteConfirm")}
              <br />
              <span className="text-destructive">{t("deleteWarning")}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={loading}>
              {tCommon("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {t("confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
