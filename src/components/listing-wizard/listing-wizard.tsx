"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepCategory } from "./step-category";
import { StepBasicInfo } from "./step-basic-info";
import { StepMetrics } from "./step-metrics";
import { StepImages } from "./step-images";
import { StepReview } from "./step-review";
import { ListingFormData } from "@/lib/schemas/listing";
// import { Progress } from "@/components/ui/progress"; // Removed unused

type Step = "category" | "info" | "metrics" | "images" | "review";

const STEPS: Step[] = ["category", "info", "metrics", "images", "review"];

export function ListingWizard() {
  const [currentStep, setCurrentStep] = useState<Step>("category");
  const [formData, setFormData] = useState<Partial<ListingFormData>>({});

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
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }} 
        />
      </div>

      <Card className="min-h-[400px]">
        <CardContent className="p-6">
          {currentStep === "category" && (
            <StepCategory 
                defaultValues={formData} 
                onNext={(data) => {
                    updateData(data);
                    nextStep();
                }} 
            />
          )}
          {currentStep === "info" && (
             <StepBasicInfo
                defaultValues={formData}
                onNext={(data) => {
                    updateData(data);
                    nextStep();
                }}
                onBack={prevStep}
             />
          )}
          {/* Other steps placeholders */}
          {currentStep === "metrics" && (
            <StepMetrics
                defaultValues={formData}
                onNext={(data) => {
                    updateData(data);
                    nextStep();
                }}
                onBack={prevStep}
            />
          )}
           {currentStep === "images" && (
             <StepImages
                defaultValues={formData}
                onNext={(data) => {
                    updateData(data);
                    nextStep();
                }}
                onBack={prevStep}
            />
          )}
           {currentStep === "review" && (
             <StepReview
                data={formData}
                onBack={prevStep}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
