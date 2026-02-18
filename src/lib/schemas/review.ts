import { z } from "zod";

export const reviewSchema = z.object({
  toUserId: z.string().uuid(),
  listingId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
