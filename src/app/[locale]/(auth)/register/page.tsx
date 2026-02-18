import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/components/auth/register-form";
import { Link } from "@/i18n/routing";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("Auth");
  return { title: t("register") };
}

export default async function RegisterPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("registerTitle")}
            </h1>
            <p className="text-muted-foreground">{t("registerSubtitle")}</p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="space-y-8 max-w-lg">
            <h2 className="text-4xl font-bold tracking-tight">
              {t("registerTitle")}
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl bg-card/50 backdrop-blur-sm p-4 border border-border/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Investment Opportunities</p>
                  <p className="text-sm text-muted-foreground">Discover profitable businesses across Europe</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-card/50 backdrop-blur-sm p-4 border border-border/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Secure Transactions</p>
                  <p className="text-sm text-muted-foreground">Verified sellers and protected deals</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-card/50 backdrop-blur-sm p-4 border border-border/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Data-Driven Insights</p>
                  <p className="text-sm text-muted-foreground">Financial metrics and growth analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
