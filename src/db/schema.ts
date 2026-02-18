import { pgTable, text, timestamp, uuid, decimal, integer, jsonb, boolean, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const listingStatusEnum = pgEnum('listing_status', ['active', 'sold', 'hidden', 'draft']);
export const metricTypeEnum = pgEnum('metric_type', ['revenue', 'profit', 'users', 'traffic', 'other']);
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const investorTypeEnum = pgEnum('investor_type', ['angel', 'vc', 'private', 'strategic', 'institutional']);
export const jobStatusEnum = pgEnum('job_status', ['active', 'closed', 'draft']);
export const jobUrgencyEnum = pgEnum('job_urgency', ['low', 'medium', 'high', 'asap']);
export const jobLevelEnum = pgEnum('job_level', ['junior', 'middle', 'senior', 'lead', 'head', 'clevel']);

// USERS
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("user").notNull(),
  bio: text("bio"),
  company: text("company"),
  website: text("website"),
  phone: text("phone"),
  country: text("country"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NEXTAUTH ACCOUNTS
export const accounts = pgTable("accounts", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

// NEXTAUTH SESSIONS
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// NEXTAUTH VERIFICATION TOKENS
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => [
  primaryKey({ columns: [vt.identifier, vt.token] }),
]);

// CATEGORIES
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameRu: text("name_ru").notNull(),
  nameFr: text("name_fr").notNull(),
  nameEs: text("name_es").notNull(),
  namePt: text("name_pt").notNull(),
  nameDe: text("name_de").notNull(),
  nameIt: text("name_it").notNull(),
  nameNl: text("name_nl").notNull(),
  parentId: uuid("parent_id"), // Self-referencing for subcategories
  icon: text("icon"), // Lucide icon slug
  order: integer("order").default(0),
});

// LISTINGS
export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("EUR").notNull(),
  country: text("country"), // ISO country code e.g. "FR", "ES"
  city: text("city"), // Optional city name
  locationType: text("location_type").default("offline"), // offline vs online
  status: listingStatusEnum("status").default("draft").notNull(),

  // Financial Highlights (Quick access)
  yearlyRevenue: decimal("yearly_revenue", { precision: 12, scale: 2 }),
  yearlyProfit: decimal("yearly_profit", { precision: 12, scale: 2 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// LISTING METRICS (Charts)
export const metrics = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id").references(() => listings.id).notNull(),
  type: metricTypeEnum("type").notNull(),
  name: text("name"), // Custom name e.g. "Monthly Active Users"
  data: jsonb("data").notNull(), // Array of { date: string, value: number }
  unit: text("unit"), // e.g. "$", "users"
});

// IMAGES
export const listingImages = pgTable("listing_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id").references(() => listings.id).notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0),
});

// INVESTOR PROFILES
export const investorProfiles = pgTable("investor_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: investorTypeEnum("type").notNull(),
  stages: jsonb("stages").$type<string[]>().default([]),
  industries: jsonb("industries").$type<string[]>().default([]),
  ticketMin: decimal("ticket_min", { precision: 12, scale: 2 }),
  ticketMax: decimal("ticket_max", { precision: 12, scale: 2 }),
  currency: text("currency").default("EUR").notNull(),
  geoFocus: jsonb("geo_focus").$type<string[]>().default([]),
  instrumentTypes: jsonb("instrument_types").$type<string[]>().default([]),
  participationType: text("participation_type"),
  requirements: text("requirements"),
  portfolio: jsonb("portfolio").$type<Array<{ name: string; url?: string }>>().default([]),
  exitStrategy: text("exit_strategy"),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// JOBS
export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  listingId: uuid("listing_id").references(() => listings.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  roleCategory: text("role_category").notNull(),
  level: jobLevelEnum("level").notNull(),
  employmentType: jsonb("employment_type").$type<string[]>().default([]),
  country: text("country"),
  city: text("city"),
  salaryMin: decimal("salary_min", { precision: 12, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 12, scale: 2 }),
  currency: text("currency").default("EUR").notNull(),
  hasEquity: boolean("has_equity").default(false).notNull(),
  equityDetails: text("equity_details"),
  experienceYears: integer("experience_years"),
  requiredStack: jsonb("required_stack").$type<string[]>().default([]),
  languages: jsonb("languages").$type<string[]>().default([]),
  urgency: jobUrgencyEnum("urgency").default("medium").notNull(),
  status: jobStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// JOB APPLICATIONS
export const jobApplications = pgTable("job_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending").notNull(), // pending, reviewed, accepted, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// FAVORITES
export const favorites = pgTable("favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  listingId: uuid("listing_id").references(() => listings.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CHAT
export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id").references(() => listings.id),
  buyerId: uuid("buyer_id").references(() => users.id).notNull(),
  sellerId: uuid("seller_id").references(() => users.id).notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  favorites: many(favorites),
  accounts: many(accounts),
  sessions: many(sessions),
  investorProfiles: many(investorProfiles),
  jobs: many(jobs),
  jobApplications: many(jobApplications),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  listing: one(listings, { fields: [favorites.listingId], references: [listings.id] }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent_child"
  }),
  children: many(categories, { relationName: "parent_child" }),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  metrics: many(metrics),
  images: many(listingImages),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  listing: one(listings, { fields: [conversations.listingId], references: [listings.id] }),
  buyer: one(users, { fields: [conversations.buyerId], references: [users.id], relationName: "buyer" }),
  seller: one(users, { fields: [conversations.sellerId], references: [users.id], relationName: "seller" }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const metricsRelations = relations(metrics, ({ one }) => ({
  listing: one(listings, { fields: [metrics.listingId], references: [listings.id] }),
}));

export const listingImagesRelations = relations(listingImages, ({ one }) => ({
  listing: one(listings, { fields: [listingImages.listingId], references: [listings.id] }),
}));

export const investorProfilesRelations = relations(investorProfiles, ({ one }) => ({
  user: one(users, { fields: [investorProfiles.userId], references: [users.id] }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  user: one(users, { fields: [jobs.userId], references: [users.id] }),
  listing: one(listings, { fields: [jobs.listingId], references: [listings.id] }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, { fields: [jobApplications.jobId], references: [jobs.id] }),
  user: one(users, { fields: [jobApplications.userId], references: [users.id] }),
}));

// Quick fix for the category listing relation field naming
// Re-doing listingsRelations to be correct
