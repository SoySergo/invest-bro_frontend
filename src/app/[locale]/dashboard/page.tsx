import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getSellerDashboard, getInvestorDashboard } from "@/lib/data/dashboard";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { DashboardListings } from "@/components/dashboard/dashboard-listings";
import { DashboardMessages } from "@/components/dashboard/dashboard-messages";
import { DashboardTips } from "@/components/dashboard/dashboard-tips";
import { InvestorDashboard } from "@/components/dashboard/investor-dashboard";
import { MonetizationSection } from "@/components/dashboard/monetization-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function generateMetadata() {
  const t = await getTranslations("Dashboard");
  return { title: t("title") };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const t = await getTranslations("Dashboard");
  const sellerData = await getSellerDashboard();
  const investorData = await getInvestorDashboard();

  return (
    <div className="container max-w-5xl py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="seller">
        <TabsList>
          <TabsTrigger value="seller">{t("sellerTab")}</TabsTrigger>
          <TabsTrigger value="investor">{t("investorTab")}</TabsTrigger>
          <TabsTrigger value="monetization">{t("monetizationTab")}</TabsTrigger>
        </TabsList>

        {/* Seller Dashboard */}
        <TabsContent value="seller" className="space-y-6 mt-4">
          {sellerData && (
            <>
              <DashboardStats
                totalViews={sellerData.totalViews}
                totalFavorites={sellerData.totalFavorites}
                totalContacts={sellerData.totalContacts}
                listingsCount={
                  sellerData.listings.filter((l) => l.status === "active").length
                }
              />
              <DashboardChart data={sellerData.viewsByDay} />
              <DashboardTips listings={sellerData.listings} />
              <DashboardListings listings={sellerData.listings} />
              <DashboardMessages messages={sellerData.recentMessages} />
            </>
          )}
        </TabsContent>

        {/* Investor Dashboard */}
        <TabsContent value="investor" className="space-y-6 mt-4">
          {investorData && <InvestorDashboard data={investorData} />}
        </TabsContent>

        {/* Monetization */}
        <TabsContent value="monetization" className="space-y-6 mt-4">
          {sellerData && (
            <MonetizationSection
              listings={sellerData.listings}
              hasPremium={sellerData.hasPremium}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
