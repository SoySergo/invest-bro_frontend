"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Trash2 } from "lucide-react";

export function ProfileSettings() {
  const t = useTranslations("Profile");

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{t("language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">{t("deleteAccount")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t("deleteAccountWarning")}
          </p>
          <Button variant="destructive" disabled>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("deleteAccount")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
