import { z } from "zod";

export const reportSchema = z.object({
  reportedUserId: z.string().uuid().optional(),
  listingId: z.string().uuid().optional(),
  reason: z.enum(["spam", "fraud", "inappropriate", "duplicate", "misleading", "other"]),
  description: z.string().max(2000).optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;
