import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl glass-card">
            {/* Chart area */}
            <div className="h-50 animate-shimmer rounded-t-xl" />

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-surface-2/30 rounded-xl">
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
    );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ListingCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function FiltersSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full sm:w-40" />
            <Skeleton className="h-10 w-full sm:w-50" />
        </div>
    );
}
