import { getJobs } from "@/lib/data/jobs";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("SEO");
  return {
    title: t("jobsTitle"),
    description: t("jobsDescription"),
    openGraph: {
      title: t("jobsTitle"),
      description: t("jobsDescription"),
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/jobs`,
    },
  };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    roleCategory?: string;
    level?: string;
    employmentType?: string;
    hasEquity?: string;
    urgency?: string;
    country?: string;
  }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("Jobs");

  const jobs = await getJobs({
    roleCategory: params.roleCategory,
    level: params.level,
    employmentType: params.employmentType,
    hasEquity: params.hasEquity,
    urgency: params.urgency,
    country: params.country,
  });

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="mb-8">
        <JobFilters
          defaultRoleCategory={params.roleCategory}
          defaultLevel={params.level}
          defaultEmploymentType={params.employmentType}
          defaultHasEquity={params.hasEquity}
          defaultUrgency={params.urgency}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">{t("noResults")}</p>
            <p>{t("beFirst")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
