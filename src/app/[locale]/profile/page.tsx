import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getProfile, getMyListings } from "@/lib/data/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <h1 className="text-2xl font-bold">{profile?.name ?? session.user.name}</h1>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
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

      {/* My Listings */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{t("myListings")}</CardTitle>
        </CardHeader>
        <CardContent>
          {myListings.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noListings")}</p>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      €{Number(listing.price).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">{listing.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
