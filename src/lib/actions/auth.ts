"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerUser(data: RegisterFormData) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid data" };
  }

  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, result.data.email),
    });

    if (existing) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    await db.insert(users).values({
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
      role: "user",
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Registration failed" };
  }
}
