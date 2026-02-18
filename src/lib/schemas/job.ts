import { z } from "zod";

export const ROLE_CATEGORIES = [
  "product-tech",
  "growth-marketing",
  "sales",
  "operations-finance",
  "hr",
  "co-founder",
  "intern",
  "adviser",
  "fractional-cxo",
  "top-management",
  "middle-management",
  "specialist",
  "production",
  "service",
  "project-management",
  "traffic",
  "development",
  "content",
  "analytics",
] as const;

export const JOB_LEVELS = [
  "junior",
  "middle",
  "senior",
  "lead",
  "head",
  "clevel",
] as const;

export const EMPLOYMENT_TYPES = [
  "fulltime",
  "parttime",
  "project",
  "freelance",
  "internship",
  "fractional",
  "remote",
  "hybrid",
  "onsite",
] as const;

export const URGENCY_LEVELS = [
  "low",
  "medium",
  "high",
  "asap",
] as const;

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  listingId: z.string().optional(),
  roleCategory: z.string().min(1, "Select a role category"),
  level: z.enum(JOB_LEVELS),
  employmentType: z.array(z.string()).min(1, "Select at least one employment type"),
  country: z.string().optional(),
  city: z.string().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().default("EUR"),
  hasEquity: z.boolean().default(false),
  equityDetails: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
  requiredStack: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  urgency: z.enum(URGENCY_LEVELS).default("medium"),
  status: z.enum(["active", "closed", "draft"]).default("draft"),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;
export type JobFormInput = z.input<typeof jobSchema>;
export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
