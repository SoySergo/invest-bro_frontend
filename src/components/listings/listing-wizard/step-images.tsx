"use client";

import { Button } from "@/components/ui/button";
import { ListingFormData } from "@/lib/schemas/listing";
import { ImageUpload, UploadedImage } from "@/components/shared/image-upload";
import { useTranslations } from "next-intl";

type StepImagesProps = {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    onNext: (data: Partial<ListingFormData>) => void;
    onBack: () => void;
};

export function StepImages({ images, onImagesChange, onNext, onBack }: StepImagesProps) {
    const t = useTranslations("Wizard");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({});
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">{t("imagesTitle")}</h2>
            <p className="text-muted-foreground">{t("imagesDesc")}</p>

            <ImageUpload
                images={images}
                onImagesChange={onImagesChange}
            />

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>{t("back")}</Button>
                <Button onClick={handleSubmit}>{t("next")}</Button>
            </div>
        </div>
    );
}
