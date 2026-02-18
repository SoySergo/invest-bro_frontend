import { getInvestorById } from "@/lib/data/investors";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { InvestorProfileForm } from "@/components/investors/investor-profile-form";

export default async function EditInvestorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Investors");
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getInvestorById(id);

  if (!profile) {
    notFound();
  }

  if (profile.userId !== session.user.id) {
    redirect("/investors");
  }

  const initialData = {
    id: profile.id,
    type: profile.type,
    stages: (profile.stages as string[]) || [],
    industries: (profile.industries as string[]) || [],
    ticketMin: Number(profile.ticketMin) || undefined,
    ticketMax: Number(profile.ticketMax) || undefined,
    currency: profile.currency,
    geoFocus: (profile.geoFocus as string[]) || [],
    instrumentTypes: (profile.instrumentTypes as string[]) || [],
    participationType: profile.participationType || undefined,
    requirements: profile.requirements || "",
    portfolio: (profile.portfolio as Array<{ name: string; url?: string }>) || [],
    exitStrategy: profile.exitStrategy || "",
    isPublic: profile.isPublic,
  };

  return (
    <div className="container py-10 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("editTitle")}</h1>
        <p className="text-muted-foreground mt-1">{t("editSubtitle")}</p>
      </div>

      <InvestorProfileForm mode="edit" initialData={initialData} />
    </div>
  );
}
