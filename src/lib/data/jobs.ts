import { db } from "@/db";
import { jobs, jobApplications } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export interface JobFilters {
  roleCategory?: string;
  level?: string;
  employmentType?: string;
  country?: string;
  hasEquity?: string;
  urgency?: string;
}

export async function getJobs(filters?: JobFilters) {
  const where = [eq(jobs.status, "active")];

  if (filters?.roleCategory) {
    where.push(eq(jobs.roleCategory, filters.roleCategory));
  }

  if (filters?.level) {
    where.push(eq(jobs.level, filters.level as "junior" | "middle" | "senior" | "lead" | "head" | "clevel"));
  }

  if (filters?.country) {
    where.push(eq(jobs.country, filters.country));
  }

  if (filters?.urgency) {
    where.push(eq(jobs.urgency, filters.urgency as "low" | "medium" | "high" | "asap"));
  }

  const allJobs = await db.query.jobs.findMany({
    where: and(...where),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          company: true,
          country: true,
          city: true,
        },
      },
      listing: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [desc(jobs.createdAt)],
  });

  let result = allJobs;

  if (filters?.employmentType) {
    result = result.filter((j) => {
      const types = j.employmentType as string[] | null;
      return types?.includes(filters.employmentType!) ?? false;
    });
  }

  if (filters?.hasEquity === "true") {
    result = result.filter((j) => j.hasEquity);
  }

  return result;
}

export async function getJobById(id: string) {
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          company: true,
          country: true,
          city: true,
          bio: true,
          website: true,
          createdAt: true,
        },
      },
      listing: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });
  return job;
}

export async function getJobApplications(jobId: string, userId: string) {
  const job = await db.query.jobs.findFirst({
    where: and(eq(jobs.id, jobId), eq(jobs.userId, userId)),
  });

  if (!job) return [];

  const applications = await db.query.jobApplications.findMany({
    where: eq(jobApplications.jobId, jobId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
    orderBy: [desc(jobApplications.createdAt)],
  });

  return applications;
}

export async function getUserApplication(jobId: string, userId: string) {
  const application = await db.query.jobApplications.findFirst({
    where: and(eq(jobApplications.jobId, jobId), eq(jobApplications.userId, userId)),
  });
  return application;
}
