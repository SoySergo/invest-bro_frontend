"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema, ListingFormData } from "@/lib/schemas/listing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/shared/markdown-editor";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { COUNTRY_CODES } from "@/lib/constants/countries";

type StepBasicInfoProps = {
    defaultValues: Partial<ListingFormData>;
    onNext: (data: Partial<ListingFormData>) => void;
    onBack: () => void;
};

const schema = basicInfoSchema;

export function StepBasicInfo({ defaultValues, onNext, onBack }: StepBasicInfoProps) {
    const t = useTranslations("Wizard");
    const tCountries = useTranslations("Countries");
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: defaultValues.title || "",
            description: defaultValues.description || "",
            price: defaultValues.price || 0,
            currency: defaultValues.currency || "EUR",
            country: defaultValues.country || "",
            city: defaultValues.city || "",
        },
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        onNext(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h2 className="text-xl font-semibold">{t("basicDetails")}</h2>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("listingTitle")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("titlePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("description")}</FormLabel>
                            <FormControl>
                                <MarkdownEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={t("descriptionPlaceholder")}
                                    className="min-h-37.5"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("askingPrice")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("country")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("selectCountry")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="REMOTE">{tCountries("REMOTE")}</SelectItem>
                                        {COUNTRY_CODES.map((code) => (
                                            <SelectItem key={code} value={code}>
                                                {tCountries(code)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("city")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("cityPlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>{t("back")}</Button>
                    <Button type="submit">{t("next")}</Button>
                </div>
            </form>
        </Form>
    );
}
