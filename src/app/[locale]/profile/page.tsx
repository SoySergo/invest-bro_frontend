import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getProfile, getMyListings } from "@/lib/data/profile";
import { getReviewsForUser, getUserRating } from "@/lib/data/reviews";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { VerificationRequest } from "@/components/shared/verification-request";
import { ReviewList } from "@/components/shared/review-list";
import { StarRating } from "@/components/shared/star-rating";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return { title: t("title") };
}

export default async function ProfilePage({
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

  const profile = await getProfile();
  const myListings = await getMyListings();
  const t = await getTranslations("Profile");
  const tNav = await getTranslations("Navigation");
  const tTrust = await getTranslations("Trust");

  const userReviews = await getReviewsForUser(session.user.id);
  const userRating = await getUserRating(session.user.id);

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-8">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.image ?? undefined} />
            <AvatarFallback>
              {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-bold">{profile?.name ?? session.user.name}</h1>
              {profile?.verificationStatus === "verified" && (
                <VerifiedBadge size="md" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
            {userRating.totalReviews > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <StarRating rating={userRating.averageRating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  ({userRating.totalReviews})
                </span>
              </div>
            )}
            {profile?.createdAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("memberSince")} {new Date(profile.createdAt).toLocaleDateString(locale)}
              </p>
            )}
          </div>
        </div>
        <Link href="/profile/settings">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            {t("settings")}
          </Button>
        </Link>
      </div>

      {/* Edit Profile Form */}
      <ProfileForm
        initialData={{
          name: profile?.name ?? null,
          bio: profile?.bio ?? null,
          company: profile?.company ?? null,
          website: profile?.website ?? null,
          phone: profile?.phone ?? null,
          country: profile?.country ?? null,
          city: profile?.city ?? null,
        }}
      />

      {/* Verification */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{tTrust("requestVerification")}</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationRequest currentStatus={profile?.verificationStatus ?? "none"} />
        </CardContent>
      </Card>

      {/* Reviews Received */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {tTrust("sellerRating")}
            {userRating.totalReviews > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({userRating.averageRating.toFixed(1)} / 5)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewList reviews={userReviews} />
        </CardContent>
      </Card>

      {/* My Listings */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("myListings")}</CardTitle>
          <Link href="/listing/create">
            <Button size="sm">{tNav("create")}</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {myListings.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noListings")}</p>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors"
                >
                  <Link href={`/listing/${listing.id}`} className="flex-1 min-w-0">
                    <p className="font-medium truncate">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      €{Number(listing.price).toLocaleString()}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 ml-3">
                    <Badge variant="outline" className={
                      listing.status === "active" ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400" :
                      listing.status === "draft" ? "border-amber-500/50 text-amber-600 dark:text-amber-400" :
                      listing.status === "sold" ? "border-blue-500/50 text-blue-600 dark:text-blue-400" :
                      "border-muted-foreground/50"
                    }>{listing.status}</Badge>
                    <Link href={`/listing/${listing.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
