"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapPin, Coins, TrendingUp, Users, Heart, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toggleFavorite } from "@/lib/actions/favorites";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data generator for charts if data is missing
const generateMockData = () => {
  return Array.from({ length: 6 }).map((_, i) => ({
    name: `Month ${i + 1}`,
    value: Math.floor(Math.random() * 5000) + 1000,
  }));
};

export function ListingCard({ listing, initialFavorite = false }: { listing: any; initialFavorite?: boolean }) {
  const t = useTranslations("ListingCard");
  const tCat = useTranslations("Categories");
  const [isFavorited, setIsFavorited] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  // Calculate payback period
  const price = Number(listing.price) || 0;
  const yearlyProfit = Number(listing.yearlyProfit) || 0;
  const paybackYears = yearlyProfit > 0 ? (price / yearlyProfit).toFixed(1) : null;

  const contentItems = [];

  // 1. Revenue Chart
  if (listing.yearlyRevenue || listing.metrics?.find((m: any) => m.type === 'revenue')) {
    const metric = listing.metrics?.find((m: any) => m.type === 'revenue');
    const data = metric?.data && metric.data.length > 0 ? metric.data : generateMockData();
    contentItems.push({
      type: 'chart',
      title: t('revenue'),
      icon: <Coins className="h-4 w-4" />,
      data: data,
      color: "#10b981",
    });
  }

  // 2. Users Chart (Mock if online)
  if (listing.locationType === 'online') {
    const metric = listing.metrics?.find((m: any) => m.type === 'users');
    const data = metric?.data && metric.data.length > 0 ? metric.data : generateMockData();
    contentItems.push({
      type: 'chart',
      title: 'Users',
      icon: <Users className="h-4 w-4" />,
      data: data,
      color: "#3b82f6",
    });
  }

  // If no content items, add a default placeholder chart
  if (contentItems.length === 0) {
    contentItems.push({
      type: 'chart',
      title: 'Performance',
      icon: <TrendingUp className="h-4 w-4" />,
      data: generateMockData(),
      color: "#8b5cf6",
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

  const categorySlug = listing.category?.slug || listing.locationType;

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-muted-foreground/10">
      <div className="relative h-[200px] bg-muted/20">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {contentItems.map((item, index) => (
              <CarouselItem key={index} className="h-[200px] flex items-center justify-center p-0">
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
                              <stop offset="5%" stopColor={item.color} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={item.color} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
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
            "bg-background/60 backdrop-blur-md shadow-sm hover:bg-background hover:scale-105 hover:shadow-md",
            isFavorited ? "text-red-500 bg-red-50/50" : "text-muted-foreground/70 hover:text-red-500"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
        </button>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
            <p className="font-bold text-lg text-primary whitespace-nowrap">
              {listing.currency} {Number(listing.price).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
            <span className="capitalize px-2 py-0.5 rounded-full bg-muted/50 text-xs font-medium">
              {tCat(categorySlug)}
            </span>
            {listing.location && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="flex items-center gap-1 text-xs truncate">
                  <MapPin className="h-3 w-3" />
                  {listing.location}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-xl border border-muted/50">
          {listing.yearlyRevenue && (
            <div>
              <p className="text-xs text-muted-foreground">{t('revenue')}</p>
              <p className="text-sm font-semibold">${Number(listing.yearlyRevenue).toLocaleString()}</p>
            </div>
          )}
          {listing.yearlyProfit && (
            <div>
              <p className="text-xs text-muted-foreground">{t('profit')}</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ${Number(listing.yearlyProfit).toLocaleString()}
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
