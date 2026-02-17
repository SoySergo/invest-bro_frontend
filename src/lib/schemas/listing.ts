import { z } from "zod";

export const categorySchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subCategory: z.string().optional(),
  type: z.enum(["online", "offline"]),
});

export const basicInfoSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Price is required")),
  currency: z.string().default("USD"),
  location: z.string().optional(), // Required only for offline?
});

export const metricsSchema = z.object({
  yearlyRevenue: z.preprocess((val) => Number(val), z.number().optional()),
  yearlyProfit: z.preprocess((val) => Number(val), z.number().optional()),
  metricType: z.enum(["revenue", "profit", "users", "traffic", "other"]).default("revenue"),
  // We will handle dynamic metrics data separately in the form state
});

export const listingSchema = z.object({
    ...categorySchema.shape,
    ...basicInfoSchema.shape,
    ...metricsSchema.shape,
});

export type ListingFormData = z.infer<typeof listingSchema>;
