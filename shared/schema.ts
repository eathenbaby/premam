import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Users (Account system)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  collegeUid: text("college_uid").notNull().unique(),
  mobileNumber: text("mobile_number").notNull(),
  instagramUsername: text("instagram_username").notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Creators (Users who receive messages)
export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  displayName: text("display_name").notNull(),
  slug: text("slug").notNull().unique(), // The custom URL part (e.g., valentine.app/to/sarah)
  passcode: text("passcode").notNull(), // Simple passcode for inbox access
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages (Confessions or Bouquets)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => creators.id),
  type: text("type").notNull(), // 'confession' | 'bouquet'

  // Confession specific
  vibe: text("vibe"), // 'coffee', 'dinner', 'talk', 'adventure', 'romance', 'friends'
  content: text("content"), // The message text

  // Bouquet specific
  bouquetId: text("bouquet_id"), // 'bouquet-01' to 'bouquet-06'
  note: text("note"), // Personal note attached to bouquet

  // Metadata (for transparency/safety)
  senderDevice: text("sender_device"),
  senderLocation: text("sender_location"),
  senderTimestamp: timestamp("sender_timestamp").defaultNow(),

  // Sender user reference (nullable for backward compat)
  senderUserId: integer("sender_user_id"),

  // NGL-style Requirement
  instagramUsername: text("instagram_username").notNull(),
  recipientName: text("recipient_name"), // Who is this confession for?
  datePreference: text("date_preference"), // 'random' | 'specific'
  recipientInstagram: text("recipient_instagram"), // IG of the person they want to go with (if specific)
  genderPreference: text("gender_preference"), // 'girl' | 'boy' | 'any'

  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
});

// Votes on public feed messages
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id),
  vote: text("vote").notNull(), // 'yes' | 'no'
  voterFingerprint: text("voter_fingerprint").notNull(), // browser fingerprint to prevent duplicates
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).pick({
  fullName: true,
  email: true,
  collegeUid: true,
  mobileNumber: true,
  instagramUsername: true,
});

export const insertCreatorSchema = createInsertSchema(creators).pick({
  displayName: true,
  slug: true,
  passcode: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  creatorId: true,
  type: true,
  vibe: true,
  content: true,
  bouquetId: true,
  note: true,
  senderDevice: true,
  senderLocation: true,
  senderUserId: true,
  instagramUsername: true,
  recipientName: true,
  datePreference: true,
  recipientInstagram: true,
  genderPreference: true,
});


export const insertVoteSchema = createInsertSchema(votes).pick({
  messageId: true,
  vote: true,
  voterFingerprint: true,
});

// === EXPLICIT API TYPES ===

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type CreateLinkRequest = InsertCreator;
export type SendMessageRequest = InsertMessage;

// Response types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CreatorResponse = Creator;
export type MessageResponse = Message;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

// Login request for inbox
export const loginSchema = z.object({
  slug: z.string(),
  passcode: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = { success: boolean; creator: Creator };
