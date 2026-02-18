import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { ProfileSettings } from "@/components/profile/profile-settings";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return { title: t("accountSettings") };
}

export default async function ProfileSettingsPage({
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

  const t = await getTranslations("Profile");

  return (
    <div className="container max-w-2xl py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("accountSettings")}</h1>
      <ProfileSettings />
    </div>
  );
}
