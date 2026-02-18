import { db } from "@/db";
import { listings, favorites, conversations, listingViews, listingImages, promotedListings, premiumSubscriptions, investorProfiles } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";

export interface ListingStats {
  id: string;
  title: string;
  price: string;
  status: string;
  createdAt: Date;
  viewCount: number;
  favoriteCount: number;
  contactCount: number;
  hasImages: boolean;
  isPromoted: boolean;
}

export interface DailyViewData {
  date: string;
  views: number;
}

export interface SellerDashboardData {
  listings: ListingStats[];
  totalViews: number;
  totalFavorites: number;
  totalContacts: number;
  viewsByDay: DailyViewData[];
  recentMessages: Array<{
    id: string;
    content: string;
    senderName: string | null;
    createdAt: Date;
    conversationId: string;
  }>;
  hasPremium: boolean;
}

export interface InvestorDashboardData {
  profileId: string | null;
  matchingProjects: Array<{
    id: string;
    title: string;
    price: string;
    category: string | null;
    country: string | null;
  }>;
  totalIncomingRequests: number;
  hasPremium: boolean;
}

export async function getSellerDashboard(): Promise<SellerDashboardData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Get user's listings
  const userListings = await db.query.listings.findMany({
    where: eq(listings.userId, userId),
    with: {
      category: true,
    },
    orderBy: (listings, { desc }) => [desc(listings.createdAt)],
  });

  // Get stats for each listing
  const listingStats: ListingStats[] = await Promise.all(
    userListings.map(async (listing) => {
      const [viewResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(listingViews)
        .where(eq(listingViews.listingId, listing.id));

      const [favResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(favorites)
        .where(eq(favorites.listingId, listing.id));

      const [contactResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(conversations)
        .where(eq(conversations.listingId, listing.id));

      const [imageResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(listingImages)
        .where(eq(listingImages.listingId, listing.id));

      const now = new Date();
      const [promoResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(promotedListings)
        .where(
          and(
            eq(promotedListings.listingId, listing.id),
            eq(promotedListings.isActive, true),
            gte(promotedListings.endDate, now)
          )
        );

      return {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        status: listing.status,
        createdAt: listing.createdAt,
        viewCount: viewResult?.count ?? 0,
        favoriteCount: favResult?.count ?? 0,
        contactCount: contactResult?.count ?? 0,
        hasImages: (imageResult?.count ?? 0) > 0,
        isPromoted: (promoResult?.count ?? 0) > 0,
      };
    })
  );

  // Calculate totals
  const totalViews = listingStats.reduce((sum, l) => sum + l.viewCount, 0);
  const totalFavorites = listingStats.reduce((sum, l) => sum + l.favoriteCount, 0);
  const totalContacts = listingStats.reduce((sum, l) => sum + l.contactCount, 0);

  // Get views by day for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const listingIds = userListings.map((l) => l.id);

  let viewsByDay: DailyViewData[] = [];
  if (listingIds.length > 0) {
    const dailyViews = await db
      .select({
        date: sql<string>`to_char(${listingViews.createdAt}, 'YYYY-MM-DD')`,
        views: sql<number>`count(*)::int`,
      })
      .from(listingViews)
      .where(
        and(
          sql`${listingViews.listingId} = ANY(${listingIds})`,
          gte(listingViews.createdAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`to_char(${listingViews.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${listingViews.createdAt}, 'YYYY-MM-DD')`);

    viewsByDay = dailyViews.map((d) => ({
      date: d.date,
      views: d.views,
    }));
  }

  // Get recent messages (last 10)
  const userConversations = await db.query.conversations.findMany({
    where: (conv, { or, eq: e }) =>
      or(e(conv.buyerId, userId), e(conv.sellerId, userId)),
  });

  const convIds = userConversations.map((c) => c.id);
  let recentMessages: SellerDashboardData["recentMessages"] = [];
  if (convIds.length > 0) {
    const msgs = await db.query.messages.findMany({
      where: (msg, { and: a, ne }) =>
        a(
          sql`${msg.conversationId} = ANY(${convIds})`,
          ne(msg.senderId, userId)
        ),
      with: {
        sender: true,
      },
      orderBy: (msg, { desc: d }) => [d(msg.createdAt)],
      limit: 5,
    });

    recentMessages = msgs.map((m) => ({
      id: m.id,
      content: m.content,
      senderName: m.sender?.name ?? null,
      createdAt: m.createdAt,
      conversationId: m.conversationId,
    }));
  }

  // Check premium
  const now = new Date();
  const [premResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(premiumSubscriptions)
    .where(
      and(
        eq(premiumSubscriptions.userId, userId),
        eq(premiumSubscriptions.status, "active"),
        gte(premiumSubscriptions.endDate, now)
      )
    );
  const hasPremium = (premResult?.count ?? 0) > 0;

  return {
    listings: listingStats,
    totalViews,
    totalFavorites,
    totalContacts,
    viewsByDay,
    recentMessages,
    hasPremium,
  };
}

export async function getInvestorDashboard(): Promise<InvestorDashboardData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Get investor profile
  const profile = await db.query.investorProfiles.findFirst({
    where: eq(investorProfiles.userId, userId),
  });

  if (!profile) {
    return {
      profileId: null,
      matchingProjects: [],
      totalIncomingRequests: 0,
      hasPremium: false,
    };
  }

  // Matching projects based on investor preferences
  const allActive = await db.query.listings.findMany({
    where: eq(listings.status, "active"),
    with: {
      category: true,
    },
    orderBy: (l, { desc: d }) => [d(l.createdAt)],
    limit: 50,
  });

  const industries = (profile.industries as string[]) ?? [];
  const geoFocus = (profile.geoFocus as string[]) ?? [];

  const scored = allActive
    .map((l) => {
      let score = 0;
      if (l.category && industries.includes(l.category.slug)) score += 2;
      if (l.country && geoFocus.includes(l.country)) score += 1;
      return { listing: l, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const matchingProjects = scored.map((s) => ({
    id: s.listing.id,
    title: s.listing.title,
    price: s.listing.price,
    category: s.listing.category?.nameEn ?? null,
    country: s.listing.country,
  }));

  // Count incoming requests (conversations of investment type where user is seller)
  const [reqResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(conversations)
    .where(
      and(
        eq(conversations.sellerId, userId),
        eq(conversations.type, "investment")
      )
    );

  // Check premium
  const now = new Date();
  const [premResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(premiumSubscriptions)
    .where(
      and(
        eq(premiumSubscriptions.userId, userId),
        eq(premiumSubscriptions.status, "active"),
        gte(premiumSubscriptions.endDate, now)
      )
    );
  const hasPremium = (premResult?.count ?? 0) > 0;

  return {
    profileId: profile.id,
    matchingProjects,
    totalIncomingRequests: reqResult?.count ?? 0,
    hasPremium,
  };
}
