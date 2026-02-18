import { getInvestors } from "@/lib/data/investors";
import { InvestorCard } from "@/components/investors/investor-card";
import { InvestorFilters } from "@/components/investors/investor-filters";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("SEO");
  return {
    title: t("investorsTitle"),
    description: t("investorsDescription"),
    openGraph: {
      title: t("investorsTitle"),
      description: t("investorsDescription"),
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/investors`,
    },
  };
}

export default async function InvestorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    stage?: string;
    industry?: string;
    country?: string;
    participationType?: string;
  }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("Investors");

  const investors = await getInvestors({
    type: params.type,
    stage: params.stage,
    industry: params.industry,
    country: params.country,
    participationType: params.participationType,
  });

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="mb-8">
        <InvestorFilters
          defaultType={params.type}
          defaultStage={params.stage}
          defaultIndustry={params.industry}
          defaultParticipationType={params.participationType}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-grid">
        {investors.map((investor) => (
          <InvestorCard key={investor.id} investor={investor} />
        ))}
        {investors.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">{t("noResults")}</p>
            <p>{t("beFirst")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
