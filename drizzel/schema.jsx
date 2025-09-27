
import { integer, pgTable, varchar, text, serial, timestamp } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer()
});

// Courses table
export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 20 }).notNull().unique(),   // e.g. "mca"
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    semesters: integer("semesters").default(0),
    likes: integer("likes").default(0),
    downloads: integer("downloads").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

// Semesters table
export const semesters = pgTable("semesters", {
    id: serial("id").primaryKey(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
    semesterNumber: integer("semester_number").notNull(),
    totalSubjects: integer("total_subjects").default(0),
});

// Subjects table
export const subjects = pgTable("subjects", {
    id: serial("id").primaryKey(),
    semesterId: integer("semester_id").references(() => semesters.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    code: varchar("code", { length: 50 }),
    description: text("description"),
});

// Resources table
export const resources = pgTable("resources", {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 150 }).notNull(),
    fileUrl: text("file_url").notNull(),          // PDF ka link (S3/Cloudinary/Supabase storage)
    fileType: varchar("file_type", { length: 20 }).default("pdf"),
    downloads: integer("downloads").default(0),
    uploadedAt: timestamp("uploaded_at").defaultNow(),
});
