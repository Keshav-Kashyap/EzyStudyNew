import { integer, pgTable, varchar, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(10),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Courses Table
export const coursesTable = pgTable("courses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    subtitle: varchar({ length: 255 }),
    description: text(),
    category: varchar({ length: 100 }).notNull(),
    image: varchar({ length: 255 }),
    bgColor: varchar({ length: 100 }),
    isActive: boolean().default(true),
    documentsCount: integer().default(0),
    studentsCount: integer().default(0),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Semesters Table
export const semestersTable = pgTable("semesters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().references(() => coursesTable.id),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Subjects Table
export const subjectsTable = pgTable("subjects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    semesterId: integer().references(() => semestersTable.id),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 50 }),
    description: text(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Study Materials Table
export const studyMaterialsTable = pgTable("study_materials", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer().references(() => subjectsTable.id),
    title: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 50 }).notNull(), // PDF, DOC, VIDEO, etc.
    fileUrl: varchar({ length: 500 }),
    description: text(),
    tags: text(), // JSON array as text
    downloadCount: integer().default(0),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// User Course Enrollments
export const enrollmentsTable = pgTable("enrollments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id),
    courseId: integer().references(() => coursesTable.id),
    enrolledAt: timestamp().defaultNow(),
    isActive: boolean().default(true)
});

// Downloads History
export const downloadsTable = pgTable("downloads", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id),
    materialId: integer().references(() => studyMaterialsTable.id),
    downloadedAt: timestamp().defaultNow()
});

// New Enhanced Tables for Admin System

// Enhanced Courses Table (for new admin system)
export const adminCourses = pgTable("admin_courses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 50 }).notNull().unique(),
    description: text(),
    duration: integer().notNull(), // in years
    totalSemesters: integer(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Enhanced Semesters Table (for new admin system)
export const adminSemesters = pgTable("admin_semesters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().references(() => adminCourses.id),
    name: varchar({ length: 100 }).notNull(),
    semesterNumber: integer().notNull(),
    description: text(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Enhanced Subjects Table (for new admin system)  
export const adminSubjects = pgTable("admin_subjects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().references(() => adminCourses.id),
    semesterId: integer().references(() => adminSemesters.id),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 50 }).notNull(),
    description: text(),
    credits: integer().notNull(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Enhanced Materials Table (for new admin system)
export const adminMaterials = pgTable("admin_materials", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().references(() => adminCourses.id),
    semesterId: integer().references(() => adminSemesters.id),
    subjectId: integer().references(() => adminSubjects.id),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    materialType: varchar({ length: 50 }).notNull(), // notes, assignment, book, presentation, video
    fileUrl: varchar({ length: 500 }),
    cloudinaryPublicId: varchar({ length: 255 }), // For Cloudinary management
    fileSize: integer(), // in bytes
    downloadCount: integer().default(0),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

