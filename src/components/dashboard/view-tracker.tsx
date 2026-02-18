"use client";

import { useEffect } from "react";
import { recordListingView } from "@/lib/actions/dashboard";

interface ViewTrackerProps {
  listingId: string;
}

export function ViewTracker({ listingId }: ViewTrackerProps) {
  useEffect(() => {
    recordListingView(listingId);
  }, [listingId]);

  return null;
}
