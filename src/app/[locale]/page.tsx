import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getListings } from '@/lib/data/listings';
import { ListingCard } from '@/components/listing-card';
import { 
  Store, Monitor, Utensils, ShoppingBag, Hotel, Car, 
  Dumbbell, Code, ShoppingCart, FileText, Smartphone, 
  Search, BarChart3, MessageCircle, Rocket, TrendingUp, Handshake,
  ArrowRight
} from 'lucide-react';

const offlineCategories = [
  { slug: 'restaurant', icon: Utensils },
  { slug: 'retail', icon: ShoppingBag },
  { slug: 'hotel', icon: Hotel },
  { slug: 'automotive', icon: Car },
  { slug: 'gym', icon: Dumbbell },
  { slug: 'service', icon: Store },
];

const onlineCategories = [
  { slug: 'saas', icon: Code },
  { slug: 'ecommerce', icon: ShoppingCart },
  { slug: 'app', icon: Smartphone },
  { slug: 'content', icon: FileText },
  { slug: 'marketplace', icon: Monitor },
  { slug: 'agency', icon: TrendingUp },
];

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const tCat = await getTranslations('Categories');
  
  // Fetch featured listings (first 6)
  const listings = await getListings();
  const featuredListings = listings.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/50 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container relative px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                {t('heroTitle')}
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/listings">
                  <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-md hover:translate-y-0 transition-transform">
                    {t('browseListings')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/listing/create">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full hover:bg-secondary/50">
                    {t('sellBusiness')}
                  </Button>
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('howItWorks')}</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Buyers */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center mb-8 text-primary">{t('forBuyers')}</h3>
              <div className="space-y-4">
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
              <div className="space-y-4">
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('categories')}</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Offline */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                {t('offlineBusinesses')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {offlineCategories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={`/listings?category=${cat.slug}`}
                    className="block group"
                  >
                    <Card className="h-full hover:bg-muted/40 transition-all duration-300 border-muted/60 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                          <cat.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-medium">{tCat(cat.slug)}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Online */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                {t('onlineBusinesses')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {onlineCategories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={`/listings?category=${cat.slug}`}
                    className="block group"
                  >
                    <Card className="h-full hover:bg-muted/40 transition-all duration-300 border-muted/60 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                          <cat.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-medium">{tCat(cat.slug)}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('featuredListings')}</h2>
            <Link href="/listings">
              <Button variant="ghost" className="gap-2">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('ctaTitle')}</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/listings">
                  <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-md hover:translate-y-0 transition-transform">
                    {t('browseListings')}
                  </Button>
                </Link>
                <Link href="/listing/create">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full hover:bg-secondary/50">
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
    <div className="flex items-start gap-5 p-6 rounded-2xl bg-card border border-muted/40 hover:border-muted-foreground/20 hover:shadow-lg transition-all duration-300">
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
