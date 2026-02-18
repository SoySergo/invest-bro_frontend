import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCategoryBySlug, getCategoriesByParent } from "@/lib/data/categories";
import { getListingsByCategorySlug } from "@/lib/data/listings";
import { ListingCard } from "@/components/listings/listing-card";
import { CATEGORY_ICONS } from "@/lib/constants/category-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Store, FolderOpen } from "lucide-react";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await getCategoryBySlug(slug);
  if (!result) return {};

  const categoryName = result.category.nameEn;

  return {
    title: `${categoryName} — InvestBro`,
    description: `Browse ${categoryName} listings on InvestBro`,
    openGraph: {
      title: `${categoryName} — InvestBro`,
      description: `Browse ${categoryName} listings on InvestBro`,
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const t = await getTranslations("CategoryPage");
  const tCat = await getTranslations("Categories");

  const result = await getCategoryBySlug(slug);
  if (!result) {
    notFound();
  }

  const { category, breadcrumbs } = result;
  const subcategories = await getCategoriesByParent(category.id);
  const listings = await getListingsByCategorySlug(slug);

  const categoryName = tCat(category.slug);

  return (
    <div className="container py-8 px-4 md:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          {t("breadcrumbHome")}
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.id} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{tCat(crumb.slug)}</span>
            ) : (
              <Link href={`/category/${crumb.slug}`} className="hover:text-foreground transition-colors">
                {tCat(crumb.slug)}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Category Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
          {categoryName}
        </h1>
      </div>

      {/* Subcategories Grid */}
      {subcategories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">{t("subcategories")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {subcategories.map((sub) => {
              const IconComponent = CATEGORY_ICONS[sub.slug] || Store;
              return (
                <Link key={sub.slug} href={`/category/${sub.slug}`} className="block group">
                  <Card className="h-full glass-card hover:bg-surface-3/40 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-medium leading-tight">{tCat(sub.slug)}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Listings in Category */}
      <section>
        <h2 className="text-xl font-semibold mb-6">
          {t("listingsInCategory", { category: categoryName })}
        </h2>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{t("noListingsInCategory")}</p>
            <Link href="/listings">
              <Button variant="outline">{t("browseAll")}</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
