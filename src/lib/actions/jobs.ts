"use server";

import { db } from "@/db";
import { jobs, jobApplications } from "@/db/schema";
import { jobSchema, jobApplicationSchema, type JobFormData, type JobApplicationFormData } from "@/lib/schemas/job";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function createJob(data: JobFormData) {
  const result = jobSchema.safeParse(data);

  if (!result.success) {
    return { success: false as const, error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  try {
    const [created] = await db.insert(jobs).values({
      userId,
      title: result.data.title,
      description: result.data.description,
      listingId: result.data.listingId || null,
      roleCategory: result.data.roleCategory,
      level: result.data.level,
      employmentType: result.data.employmentType,
      country: result.data.country || null,
      city: result.data.city || null,
      salaryMin: result.data.salaryMin?.toString(),
      salaryMax: result.data.salaryMax?.toString(),
      currency: result.data.currency,
      hasEquity: result.data.hasEquity,
      equityDetails: result.data.equityDetails || null,
      experienceYears: result.data.experienceYears ?? null,
      requiredStack: result.data.requiredStack,
      languages: result.data.languages,
      urgency: result.data.urgency,
      status: result.data.status,
    }).returning();

    revalidatePath("/jobs");
    return { success: true as const, id: created.id };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to create job" };
  }
}

export async function editJob(jobId: string, data: JobFormData) {
  const result = jobSchema.safeParse(data);

  if (!result.success) {
    return { success: false as const, error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.jobs.findFirst({
    where: and(eq(jobs.id, jobId), eq(jobs.userId, userId)),
  });

  if (!existing) {
    return { success: false as const, error: "Job not found or access denied" };
  }

  try {
    await db.update(jobs).set({
      title: result.data.title,
      description: result.data.description,
      listingId: result.data.listingId || null,
      roleCategory: result.data.roleCategory,
      level: result.data.level,
      employmentType: result.data.employmentType,
      country: result.data.country || null,
      city: result.data.city || null,
      salaryMin: result.data.salaryMin?.toString(),
      salaryMax: result.data.salaryMax?.toString(),
      currency: result.data.currency,
      hasEquity: result.data.hasEquity,
      equityDetails: result.data.equityDetails || null,
      experienceYears: result.data.experienceYears ?? null,
      requiredStack: result.data.requiredStack,
      languages: result.data.languages,
      urgency: result.data.urgency,
      status: result.data.status,
      updatedAt: new Date(),
    }).where(eq(jobs.id, jobId));

    revalidatePath("/jobs");
    revalidatePath(`/job/${jobId}`);
    return { success: true as const, id: jobId };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to update job" };
  }
}

export async function deleteJob(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.jobs.findFirst({
    where: and(eq(jobs.id, jobId), eq(jobs.userId, userId)),
  });

  if (!existing) {
    return { success: false as const, error: "Job not found or access denied" };
  }

  try {
    await db.delete(jobs).where(eq(jobs.id, jobId));

    revalidatePath("/jobs");
    revalidatePath("/profile");
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to delete job" };
  }
}

export async function applyToJob(data: JobApplicationFormData) {
  const result = jobApplicationSchema.safeParse(data);

  if (!result.success) {
    return { success: false as const, error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  const job = await db.query.jobs.findFirst({
    where: and(eq(jobs.id, result.data.jobId), eq(jobs.status, "active")),
  });

  if (!job) {
    return { success: false as const, error: "Job not found or not active" };
  }

  if (job.userId === userId) {
    return { success: false as const, error: "Cannot apply to your own job" };
  }

  const existingApplication = await db.query.jobApplications.findFirst({
    where: and(eq(jobApplications.jobId, result.data.jobId), eq(jobApplications.userId, userId)),
  });

  if (existingApplication) {
    return { success: false as const, error: "Already applied to this job" };
  }

  try {
    await db.insert(jobApplications).values({
      jobId: result.data.jobId,
      userId,
      coverLetter: result.data.coverLetter || null,
      resumeUrl: result.data.resumeUrl || null,
    });

    // Notify the job poster about the new application
    const { notifications } = await import("@/db/schema");
    await db.insert(notifications).values({
      userId: job.userId,
      type: "job_application",
      title: "New job application",
      body: `Someone applied to "${job.title}"`,
      link: `/job/${result.data.jobId}`,
    });

    revalidatePath(`/job/${result.data.jobId}`);
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to apply" };
  }
}
