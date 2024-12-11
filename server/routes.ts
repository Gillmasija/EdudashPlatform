import { type Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { assignments, submissions, schedules, users } from "@db/schema";
import { eq, and } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Get teacher's students
  app.get("/api/teacher/students", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }

    const students = await db
      .select()
      .from(users)
      .where(eq(users.teacherId, req.user.id));

    res.json(students);
  });

  // Get teacher's assignments
  app.get("/api/teacher/assignments", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }

    const teacherAssignments = await db
      .select()
      .from(assignments)
      .where(eq(assignments.teacherId, req.user.id));

    res.json(teacherAssignments);
  });

  // Create assignment
  app.post("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }

    const { title, description, dueDate } = req.body;
    const newAssignment = await db
      .insert(assignments)
      .values({
        title,
        description,
        teacherId: req.user.id,
        dueDate: new Date(dueDate),
      })
      .returning();

    res.json(newAssignment[0]);
  });

  // Get teacher's schedule
  app.get("/api/teacher/schedule", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }

    const teacherSchedule = await db
      .select()
      .from(schedules)
      .where(eq(schedules.teacherId, req.user.id));

    res.json(teacherSchedule);
  });

  // Create schedule
  app.post("/api/schedule", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }

    const { title, description, dayOfWeek, startTime, endTime } = req.body;
    const newSchedule = await db
      .insert(schedules)
      .values({
        title,
        description,
        teacherId: req.user.id,
        dayOfWeek,
        startTime,
        endTime,
      })
      .returning();

    res.json(newSchedule[0]);
  });

  // Get student's assignments
  app.get("/api/student/assignments", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "student") {
      return res.status(401).send("Unauthorized");
    }

    const studentAssignments = await db
      .select()
      .from(assignments)
      .where(eq(assignments.teacherId, req.user.teacherId!));

    res.json(studentAssignments);
  });

  // Submit assignment
  app.post("/api/submissions", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "student") {
      return res.status(401).send("Unauthorized");
    }

    const { assignmentId } = req.body;
    const newSubmission = await db
      .insert(submissions)
      .values({
        assignmentId,
        studentId: req.user.id,
        status: "completed",
      })
      .returning();

    res.json(newSubmission[0]);
  });

  return app;
}
