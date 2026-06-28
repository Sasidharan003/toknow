import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lawyersTable = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Optional: link to a registered user account
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  experience: text("experience").notNull(),
  courts: text("courts").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  languages: text("languages").notNull(), // JSON stringified array of strings
  address: text("address").notNull(),
  hours: text("hours").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "approved" | "rejected"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLawyerSchema = createInsertSchema(lawyersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLawyer = z.infer<typeof insertLawyerSchema>;
export type LawyerRow = typeof lawyersTable.$inferSelect;
