import { getListings } from "@/lib/data/listings";
import { ListingCard } from "@/components/listing-card";
import { ListingFilters } from "@/components/listing-filters";
import { getTranslations } from "next-intl/server";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; category?: string }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("Listings");
  
  const listings = await getListings({
    search: params.search,
    type: params.type,
    category: params.category,
  });

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="mb-8">
        <ListingFilters
          defaultSearch={params.search}
          defaultType={params.type}
          defaultCategory={params.category}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
        {listings.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">{t("noResults")}</p>
            <p>{t("beFirst")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
