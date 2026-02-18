import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getListings } from '@/lib/data/listings';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('SEO');
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
    },
  };
}
import { getInvestors } from '@/lib/data/investors';
import { getJobs } from '@/lib/data/jobs';
import { ListingCard } from '@/components/listings/listing-card';
import { InvestorCard } from '@/components/investors/investor-card';
import { JobCard } from '@/components/jobs/job-card';
import { ScrollRow } from '@/components/shared/scroll-row';
import { AnimatedCounter } from '@/components/shared/animated-counter';
import { getCategoriesByType } from '@/lib/data/categories';
import { CATEGORY_ICONS } from '@/lib/constants/category-icons';
import {
  Store, Monitor,
  Search, BarChart3, MessageCircle, Rocket, TrendingUp, Handshake,
  ArrowRight, Building2, Users, Briefcase, Globe
} from 'lucide-react';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const tCat = await getTranslations('Categories');

  const [allListings, onlineCats, offlineCats, investors, jobs] = await Promise.all([
    getListings(),
    getCategoriesByType("online"),
    getCategoriesByType("offline"),
    getInvestors(),
    getJobs(),
  ]);

  const featuredListings = allListings.slice(0, 8);
  const onlineListings = allListings.filter((l) => l.locationType === 'online').slice(0, 8);
  const offlineListings = allListings.filter((l) => l.locationType === 'offline').slice(0, 8);
  const latestJobs = jobs.slice(0, 8);
  const latestInvestors = investors.slice(0, 8);

  const offlineCategories = offlineCats.slice(0, 10);
  const onlineCategories = onlineCats.slice(0, 10);

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

            {/* Hero Search Bar */}
            <div className="mt-8 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Link href="/listings" className="block">
                <div className="flex items-center gap-3 h-13 px-5 rounded-2xl bg-surface-2/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-surface-2 transition-all duration-200 cursor-pointer">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="text-base">{t('heroSearchPlaceholder')}</span>
                </div>
              </Link>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
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

      {/* Trending Listings — Netflix Scroll Row */}
      {featuredListings.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ letterSpacing: '-0.02em' }}>{t('trendingListings')}</h2>
              <Link href="/listings" className="text-primary hover:underline flex items-center gap-1 font-medium text-sm">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ScrollRow>
              {featuredListings.map((listing) => (
                <div key={listing.id} className="min-w-[300px] md:min-w-[340px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </ScrollRow>
          </div>
        </section>
      )}

      {/* Online Categories Row */}
      <section className="py-12 md:py-16 bg-surface-1/50">
        <div className="container px-4 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
              <Monitor className="h-6 w-6 text-primary" />
              {t('onlineBusinesses')}
            </h2>
            <Link href="/listings?type=online" className="text-primary hover:underline flex items-center gap-1 font-medium text-sm">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ScrollRow>
            {onlineCategories.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.slug] || Monitor;
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="block group shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <div className="w-[130px] md:w-[160px] aspect-square rounded-2xl bg-gradient-to-br from-primary/80 to-chart-4/80 flex flex-col items-center justify-center gap-2 p-4 hover:scale-105 active:scale-98 transition-transform duration-200 shadow-md hover:shadow-xl">
                    <IconComponent className="h-8 w-8 text-white" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-white text-center leading-tight line-clamp-2">{tCat(cat.slug)}</span>
                  </div>
                </Link>
              );
            })}
          </ScrollRow>

          {/* Online Listings Row */}
          {onlineListings.length > 0 && (
            <div className="mt-8">
              <ScrollRow>
                {onlineListings.map((listing) => (
                  <div key={listing.id} className="min-w-[300px] md:min-w-[340px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </ScrollRow>
            </div>
          )}
        </div>
      </section>

      {/* Offline Categories Row */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
              <Store className="h-6 w-6 text-primary" />
              {t('offlineBusinesses')}
            </h2>
            <Link href="/listings?type=offline" className="text-primary hover:underline flex items-center gap-1 font-medium text-sm">
              {t('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ScrollRow>
            {offlineCategories.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.slug] || Store;
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="block group shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <div className="w-[130px] md:w-[160px] aspect-square rounded-2xl bg-gradient-to-br from-emerald-600/80 to-teal-600/80 flex flex-col items-center justify-center gap-2 p-4 hover:scale-105 active:scale-98 transition-transform duration-200 shadow-md hover:shadow-xl">
                    <IconComponent className="h-8 w-8 text-white" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-white text-center leading-tight line-clamp-2">{tCat(cat.slug)}</span>
                  </div>
                </Link>
              );
            })}
          </ScrollRow>

          {/* Offline Listings Row */}
          {offlineListings.length > 0 && (
            <div className="mt-8">
              <ScrollRow>
                {offlineListings.map((listing) => (
                  <div key={listing.id} className="min-w-[300px] md:min-w-[340px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </ScrollRow>
            </div>
          )}
        </div>
      </section>

      {/* Investors Row */}
      {latestInvestors.length > 0 && (
        <section className="py-12 md:py-16 bg-surface-1/50">
          <div className="container px-4 md:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                <TrendingUp className="h-6 w-6 text-primary" />
                {t('investorsSection')}
              </h2>
              <Link href="/investors" className="text-primary hover:underline flex items-center gap-1 font-medium text-sm">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ScrollRow>
              {latestInvestors.map((investor) => (
                <div key={investor.id} className="min-w-[300px] md:min-w-[360px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <InvestorCard investor={investor} />
                </div>
              ))}
            </ScrollRow>
          </div>
        </section>
      )}

      {/* Jobs Row */}
      {latestJobs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
                <Briefcase className="h-6 w-6 text-primary" />
                {t('jobsSection')}
              </h2>
              <Link href="/jobs" className="text-primary hover:underline flex items-center gap-1 font-medium text-sm">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ScrollRow>
              {latestJobs.map((job) => (
                <div key={job.id} className="min-w-[300px] md:min-w-[360px] shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <JobCard job={job} />
                </div>
              ))}
            </ScrollRow>
          </div>
        </section>
      )}

      {/* Platform Statistics */}
      <section className="py-16 md:py-24 bg-surface-1/50">
        <div className="container px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ letterSpacing: '-0.02em' }}>{t('platformStats')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                <AnimatedCounter target={allListings.length || 150} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">{t('statListings')}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                <AnimatedCounter target={investors.length || 50} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">{t('statInvestors')}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                <AnimatedCounter target={19} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">{t('statCountries')}</p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                <AnimatedCounter target={jobs.length || 30} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground">{t('statJobs')}</p>
            </div>
          </div>
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
  icon: React.ComponentType<{ className?: string }>;
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
