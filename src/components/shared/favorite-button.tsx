"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toggleFavorite } from "@/lib/actions/favorites";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
    listingId: string;
    initialFavorite?: boolean;
    variant?: "default" | "icon";
}

export function FavoriteButton({ listingId, initialFavorite = false, variant = "default" }: FavoriteButtonProps) {
    const t = useTranslations("ListingDetail");
    const [isFavorited, setIsFavorited] = useState(initialFavorite);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            const result = await toggleFavorite(listingId);
            if (result.error) {
                toast.error(result.error);
            } else {
                setIsFavorited(result.isFavorited ?? false);
                toast.success(result.isFavorited ? t("addToFavorites") : t("removedFromFavorites"));
            }
        });
    };

    if (variant === "icon") {
        return (
            <button
                onClick={handleClick}
                disabled={isPending}
                className={cn(
                    "p-2 rounded-full transition-all",
                    "bg-background/80 backdrop-blur-sm shadow-sm hover:scale-110",
                    isFavorited ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                )}
            >
                <Heart className={cn("h-4 w-4", isFavorited && "fill-current animate-heart-pop")} />
            </button>
        );
    }

    return (
        <Button
            variant="outline"
            className={cn("w-full gap-2", isFavorited && "text-red-500 border-red-500/50")}
            onClick={handleClick}
            disabled={isPending}
        >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
            {isFavorited ? t("inFavorites") : t("addToFavorites")}
        </Button>
    );
}
