import { getJobById } from "@/lib/data/jobs";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { JobForm } from "@/components/jobs/job-form";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Jobs");
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  if (job.userId !== session.user.id) {
    redirect("/jobs");
  }

  const initialData = {
    id: job.id,
    title: job.title,
    description: job.description,
    listingId: job.listingId || undefined,
    roleCategory: job.roleCategory,
    level: job.level,
    employmentType: (job.employmentType as string[]) || [],
    country: job.country || undefined,
    city: job.city || undefined,
    salaryMin: Number(job.salaryMin) || undefined,
    salaryMax: Number(job.salaryMax) || undefined,
    currency: job.currency,
    hasEquity: job.hasEquity,
    equityDetails: job.equityDetails || "",
    experienceYears: job.experienceYears ?? undefined,
    requiredStack: (job.requiredStack as string[]) || [],
    languages: (job.languages as string[]) || [],
    urgency: job.urgency,
    status: job.status,
  };

  return (
    <div className="container py-10 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("editTitle")}</h1>
        <p className="text-muted-foreground mt-1">{t("editSubtitle")}</p>
      </div>

      <JobForm mode="edit" initialData={initialData} />
    </div>
  );
}
