import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500).optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  website: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  phone: z.string().max(20).optional().or(z.literal("")),
  // ISO 3166-1 alpha-2 country code (e.g. "FR", "ES")
  country: z.string().max(2).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
