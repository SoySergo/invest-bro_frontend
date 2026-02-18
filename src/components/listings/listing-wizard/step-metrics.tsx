"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { metricsSchema, ListingFormData } from "@/lib/schemas/listing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useTranslations } from "next-intl";

type StepMetricsProps = {
    defaultValues: Partial<ListingFormData>;
    onNext: (data: Partial<ListingFormData>) => void;
    onBack: () => void;
};

const schema = metricsSchema;

export function StepMetrics({ defaultValues, onNext, onBack }: StepMetricsProps) {
    const t = useTranslations("Wizard");
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            yearlyRevenue: defaultValues.yearlyRevenue,
            yearlyProfit: defaultValues.yearlyProfit,
            metricType: defaultValues.metricType || "revenue",
        },
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        onNext(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h2 className="text-xl font-semibold">{t("financialMetrics")}</h2>
                <p className="text-muted-foreground">{t("financialMetricsDesc")}</p>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="yearlyRevenue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("yearlyRevenue")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearlyProfit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("yearlyProfit")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>{t("back")}</Button>
                    <Button type="submit">{t("next")}</Button>
                </div>
            </form>
        </Form>
    );
}
