"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingFormData } from "@/lib/schemas/listing";

type StepImagesProps = {
  defaultValues: Partial<ListingFormData>;
  onNext: (data: Partial<ListingFormData>) => void;
  onBack: () => void;
};

export function StepImages({ defaultValues, onNext, onBack }: StepImagesProps) {
  // Mock form for images - in real app would handle file uploads
  // For now just pass empty or mock url
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onNext({});
  };

  return (
    <div className="space-y-8">
        <h2 className="text-xl font-semibold">Images & Branding</h2>
        <p className="text-muted-foreground">Upload high quality images of your business or charts.</p>
        
        <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <div className="text-muted-foreground">
                Drag and drop images here, or click to upload.
                <br/>
                (Feature coming soon - check skipped for prototype)
            </div>
            <Button variant="secondary" className="mt-4" type="button">Upload Image</Button>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleSubmit}>Next Step</Button>
        </div>
    </div>
  );
}
