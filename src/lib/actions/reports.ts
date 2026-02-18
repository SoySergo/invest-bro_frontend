"use server";

import { db } from "@/db";
import { reports, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { reportSchema } from "@/lib/schemas/report";

export async function submitReport(data: {
  reportedUserId?: string;
  listingId?: string;
  reason: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = reportSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data" };

  const { reportedUserId, listingId, reason, description } = parsed.data;

  // Must report either a user or a listing
  if (!reportedUserId && !listingId) {
    return { success: false, error: "Must specify a user or listing to report" };
  }

  // Cannot report yourself
  if (reportedUserId === session.user.id) {
    return { success: false, error: "Cannot report yourself" };
  }

  try {
    await db.insert(reports).values({
      reporterUserId: session.user.id,
      reportedUserId: reportedUserId || null,
      listingId: listingId || null,
      reason,
      description: description || null,
    });

    revalidatePath("/admin/reports");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to submit report" };
  }
}

export async function resolveReport(reportId: string, action: "resolved" | "dismissed") {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, error: "Not authorized" };
  }

  try {
    await db.update(reports).set({
      status: action,
      resolvedBy: session.user.id,
      resolvedAt: new Date(),
    }).where(eq(reports.id, reportId));

    revalidatePath("/admin/reports");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to resolve report" };
  }
}
