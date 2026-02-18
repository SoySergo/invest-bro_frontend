"use client";

import { Button } from "@/components/ui/button";
import { ListingFormData } from "@/lib/schemas/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createListing } from "@/lib/actions/listings";
import { toast } from "sonner";
import { useRouter as useI18nRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type StepReviewProps = {
    data: Partial<ListingFormData>;
    onBack: () => void;
};

export function StepReview({ data, onBack }: StepReviewProps) {
    const t = useTranslations("Wizard");
    const tCountries = useTranslations("Countries");
    const router = useI18nRouter();

    const handleSubmit = async () => {
        try {
            const res = await createListing(data as ListingFormData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(t("publishSuccess"));
                router.push("/listings");
            }
        } catch {
            toast.error(t("publishError"));
        }
    };

    const locationDisplay = data.country
        ? `${data.city ? data.city + ", " : ""}${tCountries(data.country)}`
        : "—";

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t("review")}</h2>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>{data.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold block">{t("type")}:</span> {data.type}
                        </div>
                        <div>
                            <span className="font-semibold block">{t("category")}:</span> {data.category}
                        </div>
                        <div>
                            <span className="font-semibold block">{t("price")}:</span> {data.currency || "EUR"} {data.price}
                        </div>
                        <div>
                            <span className="font-semibold block">{t("country")}:</span> {locationDisplay}
                        </div>
                        <div>
                            <span className="font-semibold block">{t("revenue")}:</span> {data.yearlyRevenue}
                        </div>
                        <div>
                            <span className="font-semibold block">{t("profit")}:</span> {data.yearlyProfit}
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold block">{t("description")}:</span>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.description}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>{t("back")}</Button>
                <Button onClick={handleSubmit} className="bg-linear-to-r from-primary to-primary/80 btn-glow transition-all duration-200">
                    {t("publish")}
                </Button>
            </div>
        </div>
    );
}
