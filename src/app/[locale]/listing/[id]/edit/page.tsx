import { getListingById } from "@/lib/data/listing-details";
import { getCategoriesByType } from "@/lib/data/categories";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ListingWizard } from "@/components/listings/listing-wizard/listing-wizard";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const t = await getTranslations("ListingManage");

  if (!session?.user?.id) {
    redirect("/login");
  }

  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  if (listing.userId !== session.user.id) {
    notFound();
  }

  const [onlineCategories, offlineCategories] = await Promise.all([
    getCategoriesByType("online"),
    getCategoriesByType("offline"),
  ]);

  const serializeCategories = (cats: typeof onlineCategories) =>
    cats.map((c) => ({ slug: c.slug, nameEn: c.nameEn }));

  const initialData = {
    type: (listing.locationType || "offline") as "online" | "offline",
    category: listing.category?.slug || "",
    title: listing.title,
    description: listing.description,
    price: Number(listing.price) || 0,
    currency: listing.currency || "EUR",
    country: listing.country || "",
    city: listing.city || "",
    yearlyRevenue: Number(listing.yearlyRevenue) || undefined,
    yearlyProfit: Number(listing.yearlyProfit) || undefined,
    metricType: "revenue" as const,
  };

  // For existing images loaded from DB, key uses the URL since R2 keys aren't stored separately.
  // On edit save, all images are replaced, so individual R2 key tracking isn't needed.
  const initialImages = (listing.images || []).map((img) => ({
    id: img.id,
    url: img.url,
    key: img.url,
    name: `Image ${(img.order || 0) + 1}`,
    order: img.order || 0,
  }));

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("editTitle")}</h1>
        <p className="text-muted-foreground">{t("editSubtitle")}</p>
      </div>
      <ListingWizard
        onlineCategories={serializeCategories(onlineCategories)}
        offlineCategories={serializeCategories(offlineCategories)}
        initialData={initialData}
        initialImages={initialImages}
        listingId={id}
        mode="edit"
      />
    </div>
  );
}
