import { getInvestorById, getMatchingListings } from "@/lib/data/investors";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  MapPin,
  Briefcase,
  Target,
  Globe,
  Coins,
  Users,
  FileText,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { formatPrice } from "@/lib/constants/countries";
import { MarkdownViewer } from "@/components/shared/markdown-viewer";
import { auth } from "@/lib/auth";
import { ListingCard } from "@/components/listings/listing-card";

export default async function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getInvestorById(id);
  const t = await getTranslations("InvestorDetail");
  const tInvestors = await getTranslations("Investors");
  const tCountries = await getTranslations("Countries");
  const locale = await getLocale();
  const session = await auth();

  if (!profile) {
    notFound();
  }

  const isOwner = session?.user?.id === profile.userId;
  const stages = (profile.stages as string[]) || [];
  const industries = (profile.industries as string[]) || [];
  const geoFocus = (profile.geoFocus as string[]) || [];
  const instrumentTypes = (profile.instrumentTypes as string[]) || [];
  const portfolio = (profile.portfolio as Array<{ name: string; url?: string }>) || [];

  const ticketMin = Number(profile.ticketMin) || 0;
  const ticketMax = Number(profile.ticketMax) || 0;

  const matchingListings = await getMatchingListings(id, 6);

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={profile.user.image ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {profile.user.name?.charAt(0)?.toUpperCase() ?? "I"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {profile.user.name}
                </h1>
                {isOwner && (
                  <Link href={`/investor/${id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      {t("edit")}
                    </Button>
                  </Link>
                )}
              </div>
              {profile.user.company && (
                <p className="text-lg text-muted-foreground">{profile.user.company}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge className="capitalize bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                  {tInvestors(`types.${profile.type}`)}
                </Badge>
                {profile.participationType && (
                  <Badge variant="outline" className="capitalize px-3 py-1 rounded-full">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    {tInvestors(`participation.${profile.participationType}`)}
                  </Badge>
                )}
                {profile.user.country && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.user.city ? `${profile.user.city}, ` : ""}
                    {tCountries(profile.user.country)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Investment Ticket */}
          {(ticketMin > 0 || ticketMax > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  {t("investmentTicket")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {ticketMin > 0 && ticketMax > 0 ? (
                    <>
                      {formatPrice(ticketMin, profile.currency, locale)}
                      {" — "}
                      {formatPrice(ticketMax, profile.currency, locale)}
                    </>
                  ) : ticketMin > 0 ? (
                    <>{t("from")} {formatPrice(ticketMin, profile.currency, locale)}</>
                  ) : (
                    <>{t("upTo")} {formatPrice(ticketMax, profile.currency, locale)}</>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stages */}
          {stages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t("stages")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stages.map((stage) => (
                    <Badge key={stage} variant="secondary" className="capitalize px-3 py-1">
                      {tInvestors(`stages.${stage}`)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Industries */}
          {industries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t("industries")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge key={industry} variant="outline" className="capitalize px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                      {tInvestors(`industries.${industry}`)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Geo Focus */}
          {geoFocus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("geoFocus")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {geoFocus.map((code) => (
                    <Badge key={code} variant="secondary" className="px-3 py-1">
                      {tCountries(code)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instrument Types */}
          {instrumentTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("instruments")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {instrumentTypes.map((inst) => (
                    <Badge key={inst} variant="outline" className="capitalize px-3 py-1">
                      {tInvestors(`instruments.${inst}`)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {profile.requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("requirements")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownViewer content={profile.requirements} className="text-muted-foreground" />
              </CardContent>
            </Card>
          )}

          {/* Exit Strategy */}
          {profile.exitStrategy && (
            <Card>
              <CardHeader>
                <CardTitle>{t("exitStrategy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{profile.exitStrategy}</p>
              </CardContent>
            </Card>
          )}

          {/* Portfolio */}
          {portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("portfolio")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-2/30 rounded-xl border border-border/50">
                      <span className="font-medium">{project.name}</span>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t("visitProject")}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Contact & Matching */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-muted/60 shadow-lg shadow-muted/10 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 h-24 z-0" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-xl">{t("contactInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.user.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {profile.user.name?.charAt(0)?.toUpperCase() ?? "I"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{profile.user.name}</p>
                  {profile.user.company && (
                    <p className="text-sm text-muted-foreground">{profile.user.company}</p>
                  )}
                </div>
              </div>

              {profile.user.website && (
                <a
                  href={profile.user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {profile.user.website}
                </a>
              )}

              <Button className="w-full text-base py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" size="lg">
                {t("contactInvestor")}
              </Button>

              <div className="text-xs text-muted-foreground/80 text-center p-4 bg-muted/30 rounded-xl border border-muted/50">
                <p className="font-semibold mb-1 text-foreground">{t("safetyTip")}</p>
                <p>{t("safetyWarning")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Matching Listings */}
      {matchingListings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t("matchingProjects")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
