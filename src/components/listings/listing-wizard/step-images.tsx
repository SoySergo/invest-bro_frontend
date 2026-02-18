"use client";

import { Button } from "@/components/ui/button";
import { ListingFormData } from "@/lib/schemas/listing";
import { useTranslations } from "next-intl";

type StepImagesProps = {
    defaultValues: Partial<ListingFormData>;
    onNext: (data: Partial<ListingFormData>) => void;
    onBack: () => void;
};

export function StepImages({ defaultValues, onNext, onBack }: StepImagesProps) {
    const t = useTranslations("Wizard");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({});
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">{t("imagesTitle")}</h2>
            <p className="text-muted-foreground">{t("imagesDesc")}</p>

            <div className="border-2 border-dashed border-border/50 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-surface-2/20">
                <div className="text-muted-foreground">
                    {t("imagesDragDrop")}
                    <br />
                    ({t("imagesComingSoon")})
                </div>
                <Button variant="secondary" className="mt-4" type="button">{t("uploadImage")}</Button>
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>{t("back")}</Button>
                <Button onClick={handleSubmit}>{t("next")}</Button>
            </div>
        </div>
    );
}
