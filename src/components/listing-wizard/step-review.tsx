"use client";

import { Button } from "@/components/ui/button";
import { ListingFormData } from "@/lib/schemas/listing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createListing } from "@/lib/actions/listings";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Use standard router for now or i18n router
import { useRouter as useI18nRouter } from "@/i18n/routing";

type StepReviewProps = {
  data: Partial<ListingFormData>;
  onBack: () => void;
};

export function StepReview({ data, onBack }: StepReviewProps) {
  const router = useI18nRouter();
  
  const handleSubmit = async () => {
    try {
        const res = await createListing(data as ListingFormData);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Listing created successfully!");
            router.push("/listings");
        }
    } catch (error) {
        toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review your listing</h2>
      
      <Card>
        <CardHeader>
            <CardTitle>{data.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="font-semibold block">Type:</span> {data.type}
                </div>
                 <div>
                    <span className="font-semibold block">Category:</span> {data.category}
                </div>
                 <div>
                    <span className="font-semibold block">Price:</span> {data.currency} {data.price}
                </div>
                 <div>
                    <span className="font-semibold block">Location:</span> {data.location}
                </div>
                <div>
                    <span className="font-semibold block">Revenue:</span> {data.yearlyRevenue}
                </div>
                 <div>
                    <span className="font-semibold block">Profit:</span> {data.yearlyProfit}
                </div>
             </div>
             <div>
                <span className="font-semibold block">Description:</span>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.description}</p>
             </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleSubmit}>Publish Listing</Button>
      </div>
    </div>
  );
}
