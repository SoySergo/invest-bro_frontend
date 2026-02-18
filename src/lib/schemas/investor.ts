import { z } from "zod";

export const INVESTOR_TYPES = ["angel", "vc", "private", "strategic", "institutional"] as const;

export const INVESTOR_STAGES = [
  "idea",
  "mvp",
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "growth",
] as const;

export const INVESTOR_INDUSTRIES = [
  "tech",
  "ecommerce",
  "horeca",
  "healthcare",
  "edtech",
  "fintech",
  "greentech",
  "agritech",
  "proptech",
  "logtech",
  "saas",
  "retail",
  "manufacturing",
  "entertainment",
  "tourism",
  "generalist",
] as const;

export const INSTRUMENT_TYPES = [
  "equity",
  "safe",
  "convertible-note",
  "loan",
  "option",
  "revenue-share",
] as const;

export const PARTICIPATION_TYPES = [
  "passive",
  "smart-money",
  "operational",
] as const;

export const investorProfileSchema = z.object({
  type: z.enum(INVESTOR_TYPES),
  stages: z.array(z.string()).min(1, "Select at least one stage"),
  industries: z.array(z.string()).min(1, "Select at least one industry"),
  ticketMin: z.number().min(0).optional(),
  ticketMax: z.number().min(0).optional(),
  currency: z.string().default("EUR"),
  geoFocus: z.array(z.string()).default([]),
  instrumentTypes: z.array(z.string()).default([]),
  participationType: z.string().optional(),
  requirements: z.string().optional(),
  portfolio: z.array(z.object({
    name: z.string(),
    url: z.string().optional(),
  })).default([]),
  exitStrategy: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export type InvestorProfileFormData = z.infer<typeof investorProfileSchema>;
export type InvestorProfileFormInput = z.input<typeof investorProfileSchema>;
