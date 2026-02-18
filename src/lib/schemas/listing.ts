import { z } from "zod";

export const categorySchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subCategory: z.string().optional(),
  type: z.enum(["online", "offline"]),
});

export const basicInfoSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  price: z.number().min(1, "Price is required"),
  currency: z.string().min(1, "Currency is required"),
  country: z.string().optional(),
  city: z.string().optional(),
});

export const metricsSchema = z.object({
  yearlyRevenue: z.number().optional(),
  yearlyProfit: z.number().optional(),
  metricType: z.enum(["revenue", "profit", "users", "traffic", "other"]),
});

export const listingSchema = z.object({
  ...categorySchema.shape,
  ...basicInfoSchema.shape,
  ...metricsSchema.shape,
});

export type ListingFormData = z.infer<typeof listingSchema>;
