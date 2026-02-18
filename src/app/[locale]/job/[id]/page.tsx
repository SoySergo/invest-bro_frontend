import { getJobById, getUserApplication } from "@/lib/data/jobs";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  MapPin,
  Clock,
  Coins,
  Globe,
  Zap,
  FileText,
  Pencil,
  Code,
  Languages,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { formatPrice } from "@/lib/constants/countries";
import { MarkdownViewer } from "@/components/shared/markdown-viewer";
import { auth } from "@/lib/auth";
import { JobApplyButton } from "@/components/jobs/job-apply-button";
import { JobDeleteButton } from "@/components/jobs/job-delete-button";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  const t = await getTranslations("JobDetail");
  const tJobs = await getTranslations("Jobs");
  const tCountries = await getTranslations("Countries");
  const locale = await getLocale();
  const session = await auth();

  if (!job) {
    notFound();
  }

  const isOwner = session?.user?.id === job.userId;
  const employmentTypes = (job.employmentType as string[]) || [];
  const requiredStack = (job.requiredStack as string[]) || [];
  const languages = (job.languages as string[]) || [];

  const salaryMin = Number(job.salaryMin) || 0;
  const salaryMax = Number(job.salaryMax) || 0;

  const userApplication = session?.user?.id && !isOwner
    ? await getUserApplication(id, session.user.id)
    : null;

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {job.title}
              </h1>
              {isOwner && (
                <div className="flex gap-2">
                  <Link href={`/job/${id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      {t("edit")}
                    </Button>
                  </Link>
                  <JobDeleteButton jobId={id} />
                </div>
              )}
            </div>

            {(job.user.company || job.listing) && (
              <p className="text-lg text-muted-foreground">
                {job.user.company}
                {job.listing && (
                  <>
                    {job.user.company && " · "}
                    <Link href={`/listing/${job.listing.id}`} className="text-primary hover:underline">
                      {job.listing.title}
                    </Link>
                  </>
                )}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                {tJobs(`roles.${job.roleCategory}`)}
              </Badge>
              <Badge variant="outline" className="capitalize px-3 py-1 rounded-full">
                {tJobs(`levels.${job.level}`)}
              </Badge>
              {job.urgency === "asap" && (
                <Badge variant="destructive" className="px-3 py-1 rounded-full">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  {tJobs(`urgency.${job.urgency}`)}
                </Badge>
              )}
              {job.urgency === "high" && (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25 px-3 py-1 rounded-full">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  {tJobs(`urgency.${job.urgency}`)}
                </Badge>
              )}
              {job.hasEquity && (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25 px-3 py-1 rounded-full">
                  <Coins className="w-3.5 h-3.5 mr-1.5" />
                  {t("withEquity")}
                </Badge>
              )}
              {(job.country || employmentTypes.includes("remote")) && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.country ? (
                    <>
                      {job.city ? `${job.city}, ` : ""}
                      {tCountries(job.country)}
                    </>
                  ) : (
                    t("remote")
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Employment Types */}
          {employmentTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("employmentType")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employmentTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="capitalize px-3 py-1">
                      {tJobs(`employment.${type}`)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Salary & Equity */}
          {(salaryMin > 0 || salaryMax > 0 || job.hasEquity) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  {t("compensation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(salaryMin > 0 || salaryMax > 0) && (
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {salaryMin > 0 && salaryMax > 0 ? (
                      <>
                        {formatPrice(salaryMin, job.currency, locale)}
                        {" — "}
                        {formatPrice(salaryMax, job.currency, locale)}
                      </>
                    ) : salaryMin > 0 ? (
                      <>{t("from")} {formatPrice(salaryMin, job.currency, locale)}</>
                    ) : (
                      <>{t("upTo")} {formatPrice(salaryMax, job.currency, locale)}</>
                    )}
                    <span className="text-base font-normal text-muted-foreground ml-2">/ {t("year")}</span>
                  </div>
                )}
                {job.hasEquity && job.equityDetails && (
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
                      <Coins className="inline h-4 w-4 mr-1" />
                      {t("equityDetails")}
                    </p>
                    <p className="text-sm text-muted-foreground">{job.equityDetails}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("description")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownViewer content={job.description} />
            </CardContent>
          </Card>

          {/* Required Stack */}
          {requiredStack.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  {t("requiredStack")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {requiredStack.map((item) => (
                    <Badge key={item} variant="outline" className="px-3 py-1 bg-primary/5">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {t("languages")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {job.experienceYears != null && job.experienceYears > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("experience")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {job.experienceYears}+ {t("yearsExperience")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Contact & Apply */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-muted/60 shadow-lg shadow-muted/10 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 h-24 z-0" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-xl">{t("aboutCompany")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.user.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {job.user.name?.charAt(0)?.toUpperCase() ?? "J"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{job.user.name}</p>
                  {job.user.company && (
                    <p className="text-sm text-muted-foreground">{job.user.company}</p>
                  )}
                </div>
              </div>

              {job.user.website && (
                <a
                  href={job.user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {job.user.website}
                </a>
              )}

              {!isOwner && (
                <JobApplyButton
                  jobId={id}
                  hasApplied={!!userApplication}
                  isAuthenticated={!!session?.user}
                />
              )}

              <div className="text-xs text-muted-foreground/80 text-center p-4 bg-muted/30 rounded-xl border border-muted/50">
                <p className="font-semibold mb-1 text-foreground">{t("safetyTip")}</p>
                <p>{t("safetyWarning")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
