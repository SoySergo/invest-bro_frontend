"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { metricsSchema, ListingFormData } from "@/lib/schemas/listing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

type StepMetricsProps = {
  defaultValues: Partial<ListingFormData>;
  onNext: (data: Partial<ListingFormData>) => void;
  onBack: () => void;
};

const schema = metricsSchema;

export function StepMetrics({ defaultValues, onNext, onBack }: StepMetricsProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      yearlyRevenue: defaultValues.yearlyRevenue,
      yearlyProfit: defaultValues.yearlyProfit,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-semibold">Financial Metrics</h2>
        <p className="text-muted-foreground">Provide financial highlights to attract investors.</p>
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="yearlyRevenue"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Yearly Revenue (Last 12m)</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="yearlyProfit"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Yearly Net Profit</FormLabel>
                    <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}
