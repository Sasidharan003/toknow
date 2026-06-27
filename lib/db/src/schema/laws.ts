import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lawsTable = pgTable("laws", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  purpose: text("purpose"),
  rights: text("rights"),
  responsibilities: text("responsibilities"),
  penalties: text("penalties"),
  examples: text("examples"),
  faq: text("faq"),
  references: text("references"),
  isFeatured: boolean("is_featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLawSchema = createInsertSchema(lawsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLaw = z.infer<typeof insertLawSchema>;
export type Law = typeof lawsTable.$inferSelect;
