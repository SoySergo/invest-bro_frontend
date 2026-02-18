import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getListings } from '@/lib/data/listings';
import { ListingCard } from '@/components/listings/listing-card';
import { getCategoriesByType } from '@/lib/data/categories';
import { CATEGORY_ICONS } from '@/lib/constants/category-icons';
import {
  Store, Monitor,
  Search, BarChart3, MessageCircle, Rocket, TrendingUp, Handshake,
  ArrowRight
} from 'lucide-react';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const tCat = await getTranslations('Categories');

  const [listings, onlineCats, offlineCats] = await Promise.all([
    getListings(),
    getCategoriesByType("online"),
    getCategoriesByType("offline"),
  ]);
  const featuredListings = listings.slice(0, 6);

  // Take up to 6 categories per section for the grid
  const offlineCategories = offlineCats.slice(0, 6);
  const onlineCategories = onlineCats.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section — Cinematic Mesh Gradient */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36" style={{ minHeight: 'min(85vh, 700px)' }}>
        {/* Mesh gradient background */}
        <div className="absolute inset-0 hero-mesh" />
        {/* Animated decorative radials */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-chart-4/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-emerald/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container relative px-4 md:px-8">
          <div className="mx-auto max-w-180 text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-up" style={{ letterSpacing: '-0.02em' }}>
              <span className="bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                {t('heroTitle')}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '150ms' }}>
              {t('heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Link href="/listings">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg bg-linear-to-r from-primary to-primary/80 btn-glow transition-all duration-200">
                  {t('browseListings')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/listing/create">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full hover:bg-surface-2/50 backdrop-blur-sm transition-all duration-200">
                  {t('sellBusiness')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-surface-1/50">
        <div className="container px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ letterSpacing: '-0.02em' }}>{t('howItWorks')}</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Buyers */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center mb-8 text-primary">{t('forBuyers')}</h3>
              <div className="space-y-4 stagger-grid">
                <StepCard
                  number={1}
                  icon={Search}
                  title={t('step1BuyerTitle')}
                  description={t('step1BuyerDesc')}
                />
                <StepCard
                  number={2}
                  icon={BarChart3}
                  title={t('step2BuyerTitle')}
                  description={t('step2BuyerDesc')}
                />
                <StepCard
                  number={3}
                  icon={MessageCircle}
                  title={t('step3BuyerTitle')}
                  description={t('step3BuyerDesc')}
                />
              </div>
            </div>

            {/* For Sellers */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center mb-8 text-primary">{t('forSellers')}</h3>
              <div className="space-y-4 stagger-grid">
                <StepCard
                  number={1}
                  icon={Rocket}
                  title={t('step1SellerTitle')}
                  description={t('step1SellerDesc')}
                />
                <StepCard
                  number={2}
                  icon={TrendingUp}
                  title={t('step2SellerTitle')}
                  description={t('step2SellerDesc')}
                />
                <StepCard
                  number={3}
                  icon={Handshake}
                  title={t('step3SellerTitle')}
                  description={t('step3SellerDesc')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ letterSpacing: '-0.02em' }}>{t('categories')}</h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Offline */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                {t('offlineBusinesses')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger-grid">
                {offlineCategories.map((cat) => {
                  const IconComponent = CATEGORY_ICONS[cat.slug] || Store;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/listings?category=${cat.slug}`}
                      className="block group"
                    >
                      <Card className="h-full glass-card hover:bg-surface-3/40 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                          <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                            <IconComponent className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="font-medium">{tCat(cat.slug)}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Online */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                {t('onlineBusinesses')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger-grid">
                {onlineCategories.map((cat) => {
                  const IconComponent = CATEGORY_ICONS[cat.slug] || Monitor;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/listings?category=${cat.slug}`}
                      className="block group"
                    >
                      <Card className="h-full glass-card hover:bg-surface-3/40 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                          <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                            <IconComponent className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="font-medium">{tCat(cat.slug)}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 md:py-24 bg-surface-1/50">
        <div className="container px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>{t('featuredListings')}</h2>
            <Link href="/listings" className="text-primary hover:underline flex items-center gap-1 font-medium">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-grid">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              {t('noListings')}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-16 text-center glass-card">
            <div className="absolute inset-0 hero-mesh opacity-50" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>{t('ctaTitle')}</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/listings">
                  <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg bg-linear-to-r from-primary to-primary/80 btn-glow transition-all duration-200">
                    {t('browseListings')}
                  </Button>
                </Link>
                <Link href="/listing/create">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full hover:bg-surface-2/50 backdrop-blur-sm transition-all duration-200">
                    {t('sellBusiness')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  number,
  icon: Icon,
  title,
  description
}: {
  number: number;
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-5 p-6 rounded-2xl glass-card hover:border-primary/15 hover:shadow-lg transition-all duration-300">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
