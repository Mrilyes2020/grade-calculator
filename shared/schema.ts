import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Subject grade structure
export const subjectGradeSchema = z.object({
  td: z.number().min(0).max(20).nullable(),
  tp: z.number().min(0).max(20).nullable().optional(),
  exam: z.number().min(0).max(20).nullable(),
  average: z.number().min(0).max(20).nullable(),
});

export type SubjectGrade = z.infer<typeof subjectGradeSchema>;

// All grades for a submission
export const gradesDataSchema = z.object({
  proba: subjectGradeSchema,
  stat: subjectGradeSchema,
  mna: subjectGradeSchema,
  system: subjectGradeSchema,
  bd: subjectGradeSchema,
  reseaux: subjectGradeSchema,
  anglais: subjectGradeSchema,
});

export type GradesData = z.infer<typeof gradesDataSchema>;

// Grade submissions table - stores anonymous grade submissions
export const gradeSubmissions = pgTable("grade_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  grades: jsonb("grades").$type<GradesData>().notNull(),
  finalAverage: real("final_average"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGradeSubmissionSchema = createInsertSchema(gradeSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGradeSubmission = z.infer<typeof insertGradeSubmissionSchema>;
export type GradeSubmission = typeof gradeSubmissions.$inferSelect;

// Keep users table for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
