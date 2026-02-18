"use server";

import { db } from "@/db";
import { investorProfiles } from "@/db/schema";
import { investorProfileSchema, type InvestorProfileFormData } from "@/lib/schemas/investor";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function createInvestorProfile(data: InvestorProfileFormData) {
  const result = investorProfileSchema.safeParse(data);

  if (!result.success) {
    return { success: false as const, error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  try {
    const [created] = await db.insert(investorProfiles).values({
      userId,
      type: result.data.type,
      stages: result.data.stages,
      industries: result.data.industries,
      ticketMin: result.data.ticketMin?.toString(),
      ticketMax: result.data.ticketMax?.toString(),
      currency: result.data.currency,
      geoFocus: result.data.geoFocus,
      instrumentTypes: result.data.instrumentTypes,
      participationType: result.data.participationType || null,
      requirements: result.data.requirements || null,
      portfolio: result.data.portfolio,
      exitStrategy: result.data.exitStrategy || null,
      isPublic: result.data.isPublic,
    }).returning();

    revalidatePath("/investors");
    return { success: true as const, id: created.id };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to create investor profile" };
  }
}

export async function editInvestorProfile(profileId: string, data: InvestorProfileFormData) {
  const result = investorProfileSchema.safeParse(data);

  if (!result.success) {
    return { success: false as const, error: "Invalid data" };
  }

  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.investorProfiles.findFirst({
    where: and(eq(investorProfiles.id, profileId), eq(investorProfiles.userId, userId)),
  });

  if (!existing) {
    return { success: false as const, error: "Profile not found or access denied" };
  }

  try {
    await db.update(investorProfiles).set({
      type: result.data.type,
      stages: result.data.stages,
      industries: result.data.industries,
      ticketMin: result.data.ticketMin?.toString(),
      ticketMax: result.data.ticketMax?.toString(),
      currency: result.data.currency,
      geoFocus: result.data.geoFocus,
      instrumentTypes: result.data.instrumentTypes,
      participationType: result.data.participationType || null,
      requirements: result.data.requirements || null,
      portfolio: result.data.portfolio,
      exitStrategy: result.data.exitStrategy || null,
      isPublic: result.data.isPublic,
      updatedAt: new Date(),
    }).where(eq(investorProfiles.id, profileId));

    revalidatePath("/investors");
    revalidatePath(`/investor/${profileId}`);
    return { success: true as const, id: profileId };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to update investor profile" };
  }
}

export async function deleteInvestorProfile(profileId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false as const, error: "Not authenticated" };
  const userId = session.user.id;

  const existing = await db.query.investorProfiles.findFirst({
    where: and(eq(investorProfiles.id, profileId), eq(investorProfiles.userId, userId)),
  });

  if (!existing) {
    return { success: false as const, error: "Profile not found or access denied" };
  }

  try {
    await db.delete(investorProfiles).where(eq(investorProfiles.id, profileId));

    revalidatePath("/investors");
    revalidatePath("/profile");
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to delete investor profile" };
  }
}
