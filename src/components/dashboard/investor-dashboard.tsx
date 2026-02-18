"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, TrendingUp, Briefcase } from "lucide-react";
import type { InvestorDashboardData } from "@/lib/data/dashboard";

interface InvestorDashboardProps {
  data: InvestorDashboardData;
}

export function InvestorDashboard({ data }: InvestorDashboardProps) {
  const t = useTranslations("Dashboard");

  if (!data.profileId) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{t("investorDashboard")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("noInvestorProfile")}
          </p>
          <Link href="/investor/create">
            <Button size="sm">{t("createInvestorProfile")}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Investor Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.totalIncomingRequests}</p>
                <p className="text-xs text-muted-foreground">
                  {t("incomingRequests")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {data.matchingProjects.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("matchingProjects")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matching Projects */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {t("matchingProjects")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.matchingProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("noMatchingProjects")}
            </p>
          ) : (
            <div className="space-y-2">
              {data.matchingProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/listing/${project.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.category}
                      {project.country && ` · ${project.country}`}
                    </p>
                  </div>
                  <p className="text-sm font-semibold ml-3">
                    €{Number(project.price).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
