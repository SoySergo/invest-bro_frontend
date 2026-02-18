import { getListingById } from "@/lib/data/listing-details";
import { getMatchingInvestors } from "@/lib/data/investors";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Store, TrendingUp, DollarSign, Clock, MapPin, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { MarkdownViewer } from "@/components/shared/markdown-viewer";
import { formatPrice } from "@/lib/constants/countries";
import { auth } from "@/lib/auth";
import { ListingOwnerActions } from "@/components/listings/listing-owner-actions";
import Image from "next/image";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  const t = await getTranslations("ListingDetail");
  const tCountries = await getTranslations("Countries");
  const locale = await getLocale();
  const session = await auth();

  if (!listing) {
    notFound();
  }

  const matchingInvestors = await getMatchingInvestors(id, 5);

  const isOwner = session?.user?.id === listing.userId;

  // Calculate payback period
  const price = Number(listing.price) || 0;
  const yearlyProfit = Number(listing.yearlyProfit) || 0;
  const paybackYears = yearlyProfit > 0 ? (price / yearlyProfit).toFixed(1) : null;

  // Get revenue metric data for chart
  const revenueMetric = listing.metrics?.find((m: any) => m.type === 'revenue');
  const chartData = revenueMetric?.data || [];

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Main Info & Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col gap-6">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 px-3 py-1 capitalize rounded-full transition-colors">
                    {listing.locationType === 'online' ? <Globe className="w-3.5 h-3.5 mr-1.5" /> : <Store className="w-3.5 h-3.5 mr-1.5" />}
                    {listing.locationType}
                  </Badge>
                  {listing.category && (
                    <Badge variant="outline" className="capitalize px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full">
                      {listing.category.nameEn}
                    </Badge>
                  )}
                  {listing.country && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {listing.city ? `${listing.city}, ` : ""}{tCountries(listing.country)}
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">{listing.title}</h1>
                {isOwner && (
                  <ListingOwnerActions listingId={listing.id} currentStatus={listing.status} />
                )}
              </div>

              <div className="flex flex-col items-end gap-2 bg-card p-4 rounded-2xl shadow-sm border border-muted/40 min-w-50">
                <div className="text-sm font-medium text-muted-foreground">{t("askingPrice")}</div>
                <div className="text-4xl font-bold text-primary tracking-tight">
                  {formatPrice(Number(listing.price), listing.currency || "EUR", locale)}
                </div>
                {paybackYears && (
                  <div className="text-sm font-medium flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t("yearPayback", { years: paybackYears })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {listing.images && listing.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listing.images
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((img) => (
                  <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border bg-surface-2/30">
                    <Image src={img.url} alt={listing.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("overview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownViewer content={listing.description} className="text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("financials")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-5 bg-card border border-muted/40 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t("yearlyRevenue")}
                  </div>
                  <div className="text-2xl font-bold">
                    {formatPrice(Number(listing.yearlyRevenue || 0), listing.currency || "EUR", locale)}
                  </div>
                </div>

                <div className="p-5 bg-card border border-muted/40 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                      <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {t("yearlyProfit")}
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(Number(listing.yearlyProfit || 0), listing.currency || "EUR", locale)}
                  </div>
                </div>

                {paybackYears && (
                  <div className="p-5 bg-card border border-muted/40 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      {t("paybackPeriod")}
                    </div>
                    <div className="text-2xl font-bold">
                      {paybackYears} <span className="text-sm font-normal text-muted-foreground">{t("yearsLabel")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Revenue Chart */}
              <RevenueChart data={chartData as any[]} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Seller Info & Actions */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-muted/60 shadow-lg shadow-muted/10 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 h-24 z-0" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-xl">{t("sellerInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-background border-4 border-background shadow-sm flex items-center justify-center text-2xl font-bold text-primary">
                  {listing.user.name?.[0] || "U"}
                </div>
                <div>
                  <div className="font-bold text-lg">{listing.user.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    {t("memberSince")} {new Date(listing.user.createdAt).getFullYear()}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href={`/chat/start/${listing.id}`}>
                  <Button className="w-full text-base py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" size="lg">
                    {t("contactSeller")}
                  </Button>
                </Link>
                <div className="w-full">
                  <FavoriteButton listingId={listing.id} />
                </div>
              </div>

              <div className="text-xs text-muted-foreground/80 text-center p-4 bg-muted/30 rounded-xl border border-muted/50">
                <p className="font-semibold mb-1 text-foreground">{t("safetyTip")}</p>
                <p>{t("safetyWarning")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Matching Investors */}
      {matchingInvestors.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">{t("matchingInvestors")}</h2>
            <Link href="/investors" className="text-primary hover:underline text-sm font-medium">
              {t("viewAllInvestors")}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingInvestors.map((investor) => (
              <Link key={investor.id} href={`/investor/${investor.id}`}>
                <Card className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src={investor.user.image ?? undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {investor.user.name?.charAt(0)?.toUpperCase() ?? "I"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{investor.user.name}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary border-0">
                          <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                          {investor.type}
                        </Badge>
                        {investor.user.country && (
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {tCountries(investor.user.country)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
