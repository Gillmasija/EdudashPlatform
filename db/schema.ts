import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["teacher", "student"] }).notNull(),
  teacherId: integer("teacher_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "completed"] }).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  students: many(users, { relationName: "teacher_students" }),
  teacher: one(users, {
    fields: [users.teacherId],
    references: [users.id],
    relationName: "teacher_students"
  }),
  assignments: many(assignments),
  submissions: many(submissions),
  schedules: many(schedules),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id],
  }),
  submissions: many(submissions),
}));

// Schemas
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
