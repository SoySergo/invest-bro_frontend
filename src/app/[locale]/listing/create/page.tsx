import { ListingWizard } from "@/components/listings/listing-wizard/listing-wizard";
import { getTranslations } from "next-intl/server";
import { getCategoriesByType } from "@/lib/data/categories";

export default async function CreateListingPage() {
  const t = await getTranslations("Wizard");

  const [onlineCategories, offlineCategories] = await Promise.all([
    getCategoriesByType("online"),
    getCategoriesByType("offline"),
  ]);

  const serializeCategories = (cats: typeof onlineCategories) =>
    cats.map((c) => ({ slug: c.slug, nameEn: c.nameEn }));

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("sellTitle")}</h1>
        <p className="text-muted-foreground">
          {t("sellSubtitle")}
        </p>
      </div>
      <ListingWizard
        onlineCategories={serializeCategories(onlineCategories)}
        offlineCategories={serializeCategories(offlineCategories)}
      />
    </div>
  );
}
