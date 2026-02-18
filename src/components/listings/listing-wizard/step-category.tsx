"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, ListingFormData } from "@/lib/schemas/listing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store, Monitor } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useTranslations } from "next-intl";
import type { CategoryOption } from "./listing-wizard";

type StepCategoryProps = {
    defaultValues: Partial<ListingFormData>;
    onlineCategories: CategoryOption[];
    offlineCategories: CategoryOption[];
    onNext: (data: Partial<ListingFormData>) => void;
};

const schema = categorySchema;

export function StepCategory({ defaultValues, onlineCategories, offlineCategories, onNext }: StepCategoryProps) {
    const t = useTranslations("Wizard");
    const tCat = useTranslations("Categories");
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: defaultValues.type || "offline",
            category: defaultValues.category || "",
            subCategory: defaultValues.subCategory || "",
        },
    });

    const type = form.watch("type");
    const currentCategories = type === "online" ? onlineCategories : offlineCategories;

    const onSubmit = (data: z.infer<typeof schema>) => {
        onNext(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">{t("whatKind")}</h2>
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            form.setValue("category", "");
                                        }}
                                        defaultValue={field.value}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="offline" className="peer sr-only" />
                                            </FormControl>
                                            <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200">
                                                <Store className="mb-3 h-6 w-6" />
                                                {t("offlineBusiness")}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="online" className="peer sr-only" />
                                            </FormControl>
                                            <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200">
                                                <Monitor className="mb-3 h-6 w-6" />
                                                {t("onlineBusiness")}
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("category")}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("selectCategory")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {currentCategories.map((cat) => (
                                            <SelectItem key={cat.slug} value={cat.slug}>
                                                {tCat(cat.slug)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit">{t("next")}</Button>
                </div>
            </form>
        </Form>
    );
}
