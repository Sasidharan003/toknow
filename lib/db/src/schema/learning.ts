import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  lessons: integer("lessons").notNull().default(0),
  xpReward: integer("xp_reward").notNull().default(0),
  category: text("category"),
  icon: text("icon"),
});

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  questions: integer("questions").notNull().default(0),
  xpReward: integer("xp_reward").notNull().default(0),
  category: text("category"),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
export type Quiz = typeof quizzesTable.$inferSelect;
