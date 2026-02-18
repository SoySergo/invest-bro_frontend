"use client";

import { Button } from "@/components/ui/button";
import { ListingFormData } from "@/lib/schemas/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createListing, editListing } from "@/lib/actions/listings";
import { toast } from "sonner";
import { useRouter as useI18nRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { UploadedImage } from "@/components/shared/image-upload";
import Image from "next/image";

type StepReviewProps = {
    data: Partial<ListingFormData>;
    images: UploadedImage[];
    listingId?: string;
    mode?: "create" | "edit";
    onBack: () => void;
};

export function StepReview({ data, images, listingId, mode = "create", onBack }: StepReviewProps) {
    const t = useTranslations("Wizard");
    const tManage = useTranslations("ListingManage");
    const tCountries = useTranslations("Countries");
    const router = useI18nRouter();

    const handleSubmit = async () => {
        try {
            const imageData = images.map((img) => ({ url: img.url, key: img.key, order: img.order }));

            if (mode === "edit" && listingId) {
                const res = await editListing(listingId, data as ListingFormData, imageData);
                if (res.error) {
                    toast.error(res.error);
                } else {
                    toast.success(tManage("updateSuccess"));
                    router.push(`/listing/${listingId}`);
                }
            } else {
                const res = await createListing(data as ListingFormData, imageData);
                if (res.error) {
                    toast.error(res.error);
                } else {
                    toast.success(t("publishSuccess"));
                    router.push("/listings");
                }
            }
        } catch {
            toast.error(mode === "edit" ? tManage("updateError") : t("publishError"));
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

                    {images.length > 0 && (
                        <div>
                            <span className="font-semibold block mb-2">{t("stepImages")}:</span>
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border">
                                        <Image src={img.url} alt={img.name} fill className="object-cover" sizes="25vw" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>{t("back")}</Button>
                <Button onClick={handleSubmit} className="bg-linear-to-r from-primary to-primary/80 btn-glow transition-all duration-200">
                    {mode === "edit" ? tManage("savePublish") : t("publish")}
                </Button>
            </div>
        </div>
    );
}
