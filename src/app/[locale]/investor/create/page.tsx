import { getTranslations } from "next-intl/server";
import { InvestorProfileForm } from "@/components/investors/investor-profile-form";

export default async function CreateInvestorPage() {
  const t = await getTranslations("Investors");

  return (
    <div className="container py-10 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("createTitle")}</h1>
        <p className="text-muted-foreground mt-1">{t("createSubtitle")}</p>
      </div>

      <InvestorProfileForm mode="create" />
    </div>
  );
}
