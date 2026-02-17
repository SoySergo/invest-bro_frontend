import { ListingWizard } from "@/components/listing-wizard/listing-wizard";
import { useTranslations } from "next-intl";

export default function CreateListingPage() {
  const t = useTranslations("Navigation"); 
  
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sell your Business</h1>
        <p className="text-muted-foreground">
           Create a listing in a few steps.
        </p>
      </div>
      <ListingWizard />
    </div>
  );
}
