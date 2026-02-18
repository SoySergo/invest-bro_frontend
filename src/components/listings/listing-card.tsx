"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapPin, Coins, TrendingUp, Users, Heart, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toggleFavorite } from "@/lib/actions/favorites";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/constants/countries";
import { VerifiedBadge } from "@/components/shared/verified-badge";

interface MetricData {
    type: string;
    data: unknown;
    name?: string | null;
    unit?: string | null;
}

interface ListingCardData {
    id: string;
    title: string;
    description: string;
    price: string;
    currency: string | null;
    country: string | null;
    city: string | null;
    locationType: string | null;
    status: string;
    yearlyRevenue: string | null;
    yearlyProfit: string | null;
    category?: { slug: string; nameEn: string } | null;
    metrics?: MetricData[];
    user?: { verificationStatus?: string; [key: string]: unknown } | null;
}

const generateMockData = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        name: `Month ${i + 1}`,
        value: Math.floor(Math.random() * 5000) + 1000,
    }));
};

export function ListingCard({ listing, initialFavorite = false }: { listing: ListingCardData; initialFavorite?: boolean }) {
    const t = useTranslations("ListingCard");
    const tCat = useTranslations("Categories");
    const tCountries = useTranslations("Countries");
    const locale = useLocale();
    const [isFavorited, setIsFavorited] = useState(initialFavorite);
    const [isPending, startTransition] = useTransition();

    const price = Number(listing.price) || 0;
    const yearlyProfit = Number(listing.yearlyProfit) || 0;
    const paybackYears = yearlyProfit > 0 ? (price / yearlyProfit).toFixed(1) : null;

    const contentItems = [];

    const getMetricData = (data: unknown): Array<{ name: string; value: number }> => {
        if (Array.isArray(data) && data.length > 0) return data as Array<{ name: string; value: number }>;
        return generateMockData();
    };

    if (listing.yearlyRevenue || listing.metrics?.find((m) => m.type === 'revenue')) {
        const metric = listing.metrics?.find((m) => m.type === 'revenue');
        contentItems.push({
            type: 'chart',
            title: t('revenue'),
            icon: <Coins className="h-4 w-4" />,
            data: getMetricData(metric?.data),
            color: "oklch(0.65 0.20 160)",
        });
    }

    if (listing.locationType === 'online') {
        const metric = listing.metrics?.find((m) => m.type === 'users');
        contentItems.push({
            type: 'chart',
            title: 'Users',
            icon: <Users className="h-4 w-4" />,
            data: getMetricData(metric?.data),
            color: "oklch(0.55 0.25 275)",
        });
    }

    if (contentItems.length === 0) {
        contentItems.push({
            type: 'chart',
            title: 'Performance',
            icon: <TrendingUp className="h-4 w-4" />,
            data: generateMockData(),
            color: "oklch(0.60 0.25 310)",
        });
    }

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
            const result = await toggleFavorite(listing.id);
            if (result.error) {
                toast.error(result.error);
            } else {
                setIsFavorited(result.isFavorited ?? false);
                toast.success(result.isFavorited ? t('addToFavorites') : t('removeFromFavorites'));
            }
        });
    };

    const categorySlug = listing.category?.slug || listing.locationType || "other";

    return (
        <Card className="overflow-hidden glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative h-50 bg-surface-2/20">
                <Carousel className="w-full h-full">
                    <CarouselContent>
                        {contentItems.map((item, index) => (
                            <CarouselItem key={index} className="h-50 flex items-center justify-center p-0">
                                {item.type === 'chart' ? (
                                    <div className="w-full h-full flex flex-col p-4">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {item.icon}
                                            {item.title}
                                        </div>
                                        <div className="flex-1 w-full" style={{ minHeight: 120 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={item.data}>
                                                    <defs>
                                                        <linearGradient id={`gradient-${listing.id}-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={item.color} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={item.color} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="name" hide />
                                                    <YAxis hide />
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                            backdropFilter: 'blur(8px)',
                                                        }}
                                                        itemStyle={{ color: item.color }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke={item.color}
                                                        fillOpacity={1}
                                                        fill={`url(#gradient-${listing.id}-${index})`}
                                                        strokeWidth={2}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                                        Image Placeholder
                                    </div>
                                )}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {contentItems.length > 1 && (
                        <>
                            <CarouselPrevious className="left-2 bg-background/50 border-0 hover:bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all" />
                            <CarouselNext className="right-2 bg-background/50 border-0 hover:bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all" />
                        </>
                    )}
                </Carousel>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-background/60 backdrop-blur-md shadow-sm capitalize border-0 font-medium px-3 py-1">
                        {listing.locationType}
                    </Badge>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    disabled={isPending}
                    className={cn(
                        "absolute top-2 right-2 p-2.5 rounded-full transition-all duration-300",
                        "bg-background/60 backdrop-blur-md shadow-sm hover:bg-background hover:scale-110 hover:shadow-md",
                        isFavorited ? "text-red-500 bg-red-50/20" : "text-muted-foreground/70 hover:text-red-500"
                    )}
                >
                    <Heart className={cn("h-4 w-4", isFavorited && "fill-current animate-heart-pop")} />
                </button>
            </div>

            <CardContent className="p-6">
                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors flex items-center gap-1" style={{ fontWeight: 600 }}>
                            {listing.title}
                            {listing.user?.verificationStatus === "verified" && (
                                <VerifiedBadge size="sm" />
                            )}
                        </h3>
                        <p className="font-bold text-lg text-primary whitespace-nowrap">
                            {formatPrice(Number(listing.price), listing.currency || "EUR", locale)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <span className="capitalize px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {tCat(categorySlug)}
                        </span>
                        {listing.country && (
                            <>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="flex items-center gap-1 text-xs truncate">
                                    <MapPin className="h-3 w-3" />
                                    {listing.city ? `${listing.city}, ` : ""}{tCountries(listing.country)}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Financial Stats */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-surface-2/30 rounded-xl border border-border/50">
                    {listing.yearlyRevenue && (
                        <div>
                            <p className="text-xs text-muted-foreground">{t('revenue')}</p>
                            <p className="text-sm font-semibold">{formatPrice(Number(listing.yearlyRevenue), listing.currency || "EUR", locale)}</p>
                        </div>
                    )}
                    {listing.yearlyProfit && (
                        <div>
                            <p className="text-xs text-muted-foreground">{t('profit')}</p>
                            <p className="text-sm font-semibold text-emerald">
                                {formatPrice(Number(listing.yearlyProfit), listing.currency || "EUR", locale)}
                            </p>
                        </div>
                    )}
                    {paybackYears && (
                        <div>
                            <p className="text-xs text-muted-foreground">{t('payback')}</p>
                            <p className="text-sm font-semibold flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3" />
                                {paybackYears} {t('years')}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Link href={`/listing/${listing.id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                        {t('viewDetails')}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
