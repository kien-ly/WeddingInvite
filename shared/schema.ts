import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// RSVP table to store guest responses
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  attending: boolean("attending").notNull(),
  guests: integer("guests").notNull(),
  meal: text("meal"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRsvpSchema = createInsertSchema(rsvps).pick({
  name: true,
  email: true,
  attending: true,
  guests: true,
  meal: true,
  message: true,
});

// Wishes table to store guest messages
export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWishSchema = createInsertSchema(wishes).pick({
  name: true,
  message: true,
});

// Types
export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;

export type Wish = typeof wishes.$inferSelect;
export type InsertWish = z.infer<typeof insertWishSchema>;
