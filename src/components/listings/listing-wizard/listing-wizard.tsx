"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StepCategory } from "./step-category";
import { StepBasicInfo } from "./step-basic-info";
import { StepMetrics } from "./step-metrics";
import { StepImages } from "./step-images";
import { StepReview } from "./step-review";
import { ListingFormData } from "@/lib/schemas/listing";
import type { UploadedImage } from "@/components/shared/image-upload";

export interface CategoryOption {
    slug: string;
    nameEn: string;
}

interface ListingWizardProps {
    onlineCategories: CategoryOption[];
    offlineCategories: CategoryOption[];
    initialData?: Partial<ListingFormData>;
    initialImages?: UploadedImage[];
    listingId?: string;
    mode?: "create" | "edit";
}

type Step = "category" | "info" | "metrics" | "images" | "review";

const STEPS: Step[] = ["category", "info", "metrics", "images", "review"];

export function ListingWizard({
    onlineCategories,
    offlineCategories,
    initialData,
    initialImages,
    listingId,
    mode = "create",
}: ListingWizardProps) {
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [formData, setFormData] = useState<Partial<ListingFormData>>(initialData || {});
    const [images, setImages] = useState<UploadedImage[]>(initialImages || []);

    const stepIndex = STEPS.indexOf(currentStep);
    const progress = ((stepIndex + 1) / STEPS.length) * 100;

    const nextStep = () => {
        const next = STEPS[stepIndex + 1];
        if (next) setCurrentStep(next);
    };

    const prevStep = () => {
        const prev = STEPS[stepIndex - 1];
        if (prev) setCurrentStep(prev);
    };

    const updateData = (data: Partial<ListingFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                <div
                    className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <Card className="min-h-100 glass-card">
                <CardContent className="p-6">
                    {currentStep === "category" && (
                        <StepCategory
                            defaultValues={formData}
                            onlineCategories={onlineCategories}
                            offlineCategories={offlineCategories}
                            onNext={(data: Partial<ListingFormData>) => {
                                updateData(data);
                                nextStep();
                            }}
                        />
                    )}
                    {currentStep === "info" && (
                        <StepBasicInfo
                            defaultValues={formData}
                            onNext={(data: Partial<ListingFormData>) => {
                                updateData(data);
                                nextStep();
                            }}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === "metrics" && (
                        <StepMetrics
                            defaultValues={formData}
                            onNext={(data: Partial<ListingFormData>) => {
                                updateData(data);
                                nextStep();
                            }}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === "images" && (
                        <StepImages
                            images={images}
                            onImagesChange={setImages}
                            onNext={(data: Partial<ListingFormData>) => {
                                updateData(data);
                                nextStep();
                            }}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === "review" && (
                        <StepReview
                            data={formData}
                            images={images}
                            listingId={listingId}
                            mode={mode}
                            onBack={prevStep}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
