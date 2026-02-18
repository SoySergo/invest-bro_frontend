import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "investbro-dev-secret-change-in-production",
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        let user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        // Auto-seed admin user on first login attempt
        if (!user && email === "admin@investbro.com") {
          const hashedPassword = await bcrypt.hash("admin", 12);
          const [newUser] = await db
            .insert(users)
            .values({
              email: "admin@investbro.com",
              name: "Admin",
              password: hashedPassword,
              role: "admin",
            })
            .returning();
          user = newUser;
        }

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
