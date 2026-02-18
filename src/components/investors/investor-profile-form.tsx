"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  investorProfileSchema,
  type InvestorProfileFormData,
  INVESTOR_TYPES,
  INVESTOR_STAGES,
  INVESTOR_INDUSTRIES,
  INSTRUMENT_TYPES,
  PARTICIPATION_TYPES,
} from "@/lib/schemas/investor";
import { createInvestorProfile, editInvestorProfile } from "@/lib/actions/investors";
import { COUNTRY_CODES } from "@/lib/constants/countries";

interface InvestorProfileFormProps {
  initialData?: InvestorProfileFormData & { id?: string };
  mode: "create" | "edit";
}

export function InvestorProfileForm({ initialData, mode }: InvestorProfileFormProps) {
  const t = useTranslations("Investors");
  const tCountries = useTranslations("Countries");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvestorProfileFormData>({
    resolver: zodResolver(investorProfileSchema),
    defaultValues: initialData || {
      type: "angel",
      stages: [],
      industries: [],
      ticketMin: undefined,
      ticketMax: undefined,
      currency: "EUR",
      geoFocus: [],
      instrumentTypes: [],
      participationType: undefined,
      requirements: "",
      portfolio: [],
      exitStrategy: "",
      isPublic: true,
    },
  });

  const selectedStages = watch("stages") || [];
  const selectedIndustries = watch("industries") || [];
  const selectedGeoFocus = watch("geoFocus") || [];
  const selectedInstrumentTypes = watch("instrumentTypes") || [];
  const portfolio = watch("portfolio") || [];

  const toggleArrayItem = (field: "stages" | "industries" | "geoFocus" | "instrumentTypes", item: string) => {
    const current = watch(field) || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    setValue(field, updated, { shouldValidate: true });
  };

  const addPortfolioItem = () => {
    setValue("portfolio", [...portfolio, { name: "", url: "" }]);
  };

  const removePortfolioItem = (index: number) => {
    setValue("portfolio", portfolio.filter((_, i) => i !== index));
  };

  const updatePortfolioItem = (index: number, field: "name" | "url", value: string) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    setValue("portfolio", updated);
  };

  const onSubmit = (data: InvestorProfileFormData) => {
    startTransition(async () => {
      const result = mode === "edit" && initialData?.id
        ? await editInvestorProfile(initialData.id, data)
        : await createInvestorProfile(data);

      if (result.success) {
        toast.success(mode === "edit" ? t("profileUpdated") : t("profileCreated"));
        if ("id" in result && result.id) {
          router.push(`/investor/${result.id}`);
        } else {
          router.push("/investors");
        }
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Investor Type */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.typeTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={watch("type")}
            onValueChange={(value) => setValue("type", value as InvestorProfileFormData["type"])}
          >
            <SelectTrigger className="bg-surface-2/50">
              <SelectValue placeholder={t("form.selectType")} />
            </SelectTrigger>
            <SelectContent>
              {INVESTOR_TYPES.map((investorType) => (
                <SelectItem key={investorType} value={investorType}>
                  {t(`types.${investorType}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
        </CardContent>
      </Card>

      {/* Investment Stages */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.stagesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INVESTOR_STAGES.map((stage) => (
              <Badge
                key={stage}
                variant={selectedStages.includes(stage) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105 capitalize"
                onClick={() => toggleArrayItem("stages", stage)}
              >
                {t(`stages.${stage}`)}
              </Badge>
            ))}
          </div>
          {errors.stages && <p className="text-sm text-destructive mt-2">{errors.stages.message}</p>}
        </CardContent>
      </Card>

      {/* Industries */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.industriesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INVESTOR_INDUSTRIES.map((industry) => (
              <Badge
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105 capitalize"
                onClick={() => toggleArrayItem("industries", industry)}
              >
                {t(`industries.${industry}`)}
              </Badge>
            ))}
          </div>
          {errors.industries && <p className="text-sm text-destructive mt-2">{errors.industries.message}</p>}
        </CardContent>
      </Card>

      {/* Investment Ticket */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.ticketTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("form.ticketMin")}</Label>
              <Input
                type="number"
                placeholder="10000"
                className="bg-surface-2/50"
                {...register("ticketMin", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>{t("form.ticketMax")}</Label>
              <Input
                type="number"
                placeholder="500000"
                className="bg-surface-2/50"
                {...register("ticketMax", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div>
            <Label>{t("form.currency")}</Label>
            <Select
              value={watch("currency")}
              onValueChange={(value) => setValue("currency", value)}
            >
              <SelectTrigger className="bg-surface-2/50 w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CHF">CHF</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Geo Focus */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.geoFocusTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {COUNTRY_CODES.map((code) => (
              <Badge
                key={code}
                variant={selectedGeoFocus.includes(code) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleArrayItem("geoFocus", code)}
              >
                {tCountries(code)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instrument Types */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.instrumentsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENT_TYPES.map((instrument) => (
              <Badge
                key={instrument}
                variant={selectedInstrumentTypes.includes(instrument) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105 capitalize"
                onClick={() => toggleArrayItem("instrumentTypes", instrument)}
              >
                {t(`instruments.${instrument}`)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participation Type */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.participationTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={watch("participationType") || ""}
            onValueChange={(value) => setValue("participationType", value)}
          >
            <SelectTrigger className="bg-surface-2/50">
              <SelectValue placeholder={t("form.selectParticipation")} />
            </SelectTrigger>
            <SelectContent>
              {PARTICIPATION_TYPES.map((pt) => (
                <SelectItem key={pt} value={pt}>
                  {t(`participation.${pt}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.requirementsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t("form.requirementsPlaceholder")}
            className="bg-surface-2/50 min-h-[120px]"
            {...register("requirements")}
          />
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t("form.portfolioTitle")}
            <Button type="button" variant="outline" size="sm" onClick={addPortfolioItem}>
              <Plus className="h-4 w-4 mr-1" />
              {t("form.addProject")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {portfolio.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                placeholder={t("form.projectName")}
                value={item.name}
                onChange={(e) => updatePortfolioItem(index, "name", e.target.value)}
                className="bg-surface-2/50 flex-1"
              />
              <Input
                placeholder={t("form.projectUrl")}
                value={item.url || ""}
                onChange={(e) => updatePortfolioItem(index, "url", e.target.value)}
                className="bg-surface-2/50 flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removePortfolioItem(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {portfolio.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("form.noPortfolio")}</p>
          )}
        </CardContent>
      </Card>

      {/* Exit Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.exitStrategyTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t("form.exitStrategyPlaceholder")}
            className="bg-surface-2/50 min-h-[80px]"
            {...register("exitStrategy")}
          />
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.visibilityTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublic"
              checked={watch("isPublic")}
              onCheckedChange={(checked) => setValue("isPublic", checked === true)}
            />
            <Label htmlFor="isPublic">{t("form.publicProfile")}</Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={isPending} className="bg-linear-to-r from-primary to-primary/80 btn-glow">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {mode === "edit" ? t("form.saveChanges") : t("form.createProfile")}
        </Button>
      </div>
    </form>
  );
}
