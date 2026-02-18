"use client";

import { useEffect, useRef } from "react";
import { recordListingView } from "@/lib/actions/dashboard";

interface ViewTrackerProps {
  listingId: string;
}

export function ViewTracker({ listingId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      recordListingView(listingId);
    }
  }, [listingId]);

  return null;
}
