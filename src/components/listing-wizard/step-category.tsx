"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, ListingFormData } from "@/lib/schemas/listing";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

type StepCategoryProps = {
  defaultValues: Partial<ListingFormData>;
  onNext: (data: Partial<ListingFormData>) => void;
};

const schema = categorySchema;

export function StepCategory({ defaultValues, onNext }: StepCategoryProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultValues.type || "offline",
      category: defaultValues.category || "",
      subCategory: defaultValues.subCategory || "",
    },
  });

  const type = form.watch("type");

  const onSubmit = (data: z.infer<typeof schema>) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">What kind of business are you selling?</h2>
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                    >
                    <FormItem>
                        <FormControl>
                        <RadioGroupItem value="offline" className="peer sr-only" />
                        </FormControl>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <Store className="mb-3 h-6 w-6" />
                        Offline Business
                        </FormLabel>
                    </FormItem>
                    <FormItem>
                        <FormControl>
                        <RadioGroupItem value="online" className="peer sr-only" />
                        </FormControl>
                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <Monitor className="mb-3 h-6 w-6" />
                        Online Business
                        </FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {type === "offline" ? (
                          <>
                            <SelectItem value="restaurant">Restaurant / Cafe</SelectItem>
                            <SelectItem value="retail">Retail Store</SelectItem>
                            <SelectItem value="service">Service Business</SelectItem>
                            <SelectItem value="hotel">Hotel / Hospitality</SelectItem>
                          </>
                      ) : (
                          <>
                             <SelectItem value="saas">SaaS</SelectItem>
                             <SelectItem value="ecommerce">E-commerce</SelectItem>
                             <SelectItem value="content">Content / Blog</SelectItem>
                             <SelectItem value="app">Mobile App</SelectItem>
                          </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}
