"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollRow({ children, className }: ScrollRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>

      {/* Left Arrow */}
      {canScrollLeft && isHovered && (
        <div className="hidden md:flex absolute left-0 top-0 bottom-2 w-16 items-center justify-start bg-gradient-to-r from-background/80 to-transparent z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-surface-2/80 backdrop-blur-sm shadow-lg hover:bg-surface-3 transition-all"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Right Arrow */}
      {canScrollRight && isHovered && (
        <div className="hidden md:flex absolute right-0 top-0 bottom-2 w-16 items-center justify-end bg-gradient-to-l from-background/80 to-transparent z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-surface-2/80 backdrop-blur-sm shadow-lg hover:bg-surface-3 transition-all"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
