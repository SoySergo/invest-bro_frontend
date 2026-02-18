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
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  jobSchema,
  type JobFormInput,
  ROLE_CATEGORIES,
  JOB_LEVELS,
  EMPLOYMENT_TYPES,
  URGENCY_LEVELS,
} from "@/lib/schemas/job";
import { createJob, editJob } from "@/lib/actions/jobs";
import { COUNTRY_CODES } from "@/lib/constants/countries";

interface JobFormProps {
  initialData?: JobFormInput & { id?: string };
  mode: "create" | "edit";
}

export function JobForm({ initialData, mode }: JobFormProps) {
  const t = useTranslations("Jobs");
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
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      listingId: undefined,
      roleCategory: "",
      level: "middle",
      employmentType: [],
      country: undefined,
      city: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      currency: "EUR",
      hasEquity: false,
      equityDetails: "",
      experienceYears: undefined,
      requiredStack: [],
      languages: [],
      urgency: "medium",
      status: "active",
    },
  });

  const selectedEmploymentTypes = watch("employmentType") || [];
  const selectedRequiredStack = watch("requiredStack") || [];
  const selectedLanguages = watch("languages") || [];
  const hasEquity = watch("hasEquity");

  const toggleArrayItem = (field: "employmentType" | "requiredStack" | "languages", item: string) => {
    const current = watch(field) || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    setValue(field, updated, { shouldValidate: true });
  };

  const [newStackItem, setNewStackItem] = useState("");
  const [newLanguageItem, setNewLanguageItem] = useState("");

  const onSubmit = (data: JobFormInput) => {
    startTransition(async () => {
      const parsed = jobSchema.safeParse(data);
      if (!parsed.success) {
        toast.error("Invalid data");
        return;
      }
      const result = mode === "edit" && initialData?.id
        ? await editJob(initialData.id, parsed.data)
        : await createJob(parsed.data);

      if (result.success) {
        toast.success(mode === "edit" ? t("jobUpdated") : t("jobCreated"));
        if ("id" in result && result.id) {
          router.push(`/job/${result.id}`);
        } else {
          router.push("/jobs");
        }
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.titleLabel")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={t("form.titlePlaceholder")}
            className="bg-surface-2/50"
            {...register("title")}
          />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
        </CardContent>
      </Card>

      {/* Role Category & Level */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.roleLevelTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("form.roleCategory")}</Label>
            <Select
              value={watch("roleCategory")}
              onValueChange={(value) => setValue("roleCategory", value)}
            >
              <SelectTrigger className="bg-surface-2/50">
                <SelectValue placeholder={t("form.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                {ROLE_CATEGORIES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {t(`roles.${role}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleCategory && <p className="text-sm text-destructive mt-1">{errors.roleCategory.message}</p>}
          </div>
          <div>
            <Label>{t("form.level")}</Label>
            <Select
              value={watch("level")}
              onValueChange={(value) => setValue("level", value as JobFormInput["level"])}
            >
              <SelectTrigger className="bg-surface-2/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {t(`levels.${l}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.descriptionTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={t("form.descriptionPlaceholder")}
            className="bg-surface-2/50 min-h-[200px]"
            {...register("description")}
          />
          {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          <p className="text-xs text-muted-foreground mt-1">{t("form.markdownSupported")}</p>
        </CardContent>
      </Card>

      {/* Employment Type */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.employmentTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((et) => (
              <Badge
                key={et}
                variant={selectedEmploymentTypes.includes(et) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105 capitalize"
                onClick={() => toggleArrayItem("employmentType", et)}
              >
                {t(`employment.${et}`)}
              </Badge>
            ))}
          </div>
          {errors.employmentType && <p className="text-sm text-destructive mt-2">{errors.employmentType.message}</p>}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.locationTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("form.country")}</Label>
            <Select
              value={watch("country") || ""}
              onValueChange={(value) => setValue("country", value === "none" ? undefined : value)}
            >
              <SelectTrigger className="bg-surface-2/50">
                <SelectValue placeholder={t("form.selectCountry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("form.remoteGlobal")}</SelectItem>
                {COUNTRY_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {tCountries(code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("form.city")}</Label>
            <Input
              placeholder={t("form.cityPlaceholder")}
              className="bg-surface-2/50"
              {...register("city")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Salary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.salaryTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("form.salaryMin")}</Label>
              <Input
                type="number"
                placeholder="30000"
                className="bg-surface-2/50"
                {...register("salaryMin", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>{t("form.salaryMax")}</Label>
              <Input
                type="number"
                placeholder="80000"
                className="bg-surface-2/50"
                {...register("salaryMax", { valueAsNumber: true })}
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

      {/* Equity */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.equityTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="hasEquity"
              checked={hasEquity}
              onCheckedChange={(checked) => setValue("hasEquity", checked === true)}
            />
            <Label htmlFor="hasEquity">{t("form.hasEquity")}</Label>
          </div>
          {hasEquity && (
            <Textarea
              placeholder={t("form.equityDetailsPlaceholder")}
              className="bg-surface-2/50 min-h-[80px]"
              {...register("equityDetails")}
            />
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.experienceTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            placeholder="3"
            className="bg-surface-2/50 w-full sm:w-40"
            {...register("experienceYears", { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground mt-1">{t("form.experienceHint")}</p>
        </CardContent>
      </Card>

      {/* Required Stack */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.stackTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedRequiredStack.map((item) => (
              <Badge key={item} variant="default" className="gap-1">
                {item}
                <button type="button" onClick={() => toggleArrayItem("requiredStack", item)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t("form.addStackItem")}
              className="bg-surface-2/50 flex-1"
              value={newStackItem}
              onChange={(e) => setNewStackItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newStackItem.trim()) {
                    toggleArrayItem("requiredStack", newStackItem.trim());
                    setNewStackItem("");
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (newStackItem.trim()) {
                  toggleArrayItem("requiredStack", newStackItem.trim());
                  setNewStackItem("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.languagesTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((item) => (
              <Badge key={item} variant="default" className="gap-1">
                {item}
                <button type="button" onClick={() => toggleArrayItem("languages", item)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t("form.addLanguage")}
              className="bg-surface-2/50 flex-1"
              value={newLanguageItem}
              onChange={(e) => setNewLanguageItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newLanguageItem.trim()) {
                    toggleArrayItem("languages", newLanguageItem.trim());
                    setNewLanguageItem("");
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (newLanguageItem.trim()) {
                  toggleArrayItem("languages", newLanguageItem.trim());
                  setNewLanguageItem("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Urgency */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.urgencyTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={watch("urgency")}
            onValueChange={(value) => setValue("urgency", value as JobFormInput["urgency"])}
          >
            <SelectTrigger className="bg-surface-2/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {URGENCY_LEVELS.map((u) => (
                <SelectItem key={u} value={u}>
                  {t(`urgency.${u}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>{t("form.statusTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as JobFormInput["status"])}
          >
            <SelectTrigger className="bg-surface-2/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("form.statusActive")}</SelectItem>
              <SelectItem value="draft">{t("form.statusDraft")}</SelectItem>
              <SelectItem value="closed">{t("form.statusClosed")}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {tCommon("cancel")}
        </Button>
        <Button type="submit" disabled={isPending} className="bg-linear-to-r from-primary to-primary/80 btn-glow">
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {mode === "edit" ? t("form.saveChanges") : t("form.publishJob")}
        </Button>
      </div>
    </form>
  );
}
