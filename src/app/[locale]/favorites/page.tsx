import { getFavoriteListings } from "@/lib/actions/favorites";
import { ListingCard } from "@/components/listing-card";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default async function FavoritesPage() {
  const t = await getTranslations("Favorites");
  const listings = await getFavoriteListings();

  return (
    <div className="container py-10 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} initialFavorite={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("empty")}</h2>
          <p className="text-muted-foreground mb-6">{t("emptyDesc")}</p>
          <Link href="/listings">
            <Button>Browse Listings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
