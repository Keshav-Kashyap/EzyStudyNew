import { integer, pgTable, varchar, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull().unique(), // Clerk user ID
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: varchar({ length: 50 }).default('student'), // 'admin' or 'student'
    isActive: boolean().default(true),
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
    duration: integer().default(3), // Duration in years (e.g., 3 for BCA)
    image: varchar({ length: 255 }),
    bgColor: varchar({ length: 100 }),
    isActive: boolean().default(true),
    documentsCount: integer().default(0),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Semesters Table
export const semestersTable = pgTable("semesters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    category: text().notNull(), // Links to coursesTable.category
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

// Subjects Table
export const subjectsTable = pgTable("subjects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    category: text().notNull(), // Links to coursesTable.category
    semesterName: varchar({ length: 100 }).notNull(), // Links to semestersTable.name
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
    likes: integer("likes").default(0),
    imageUrl: text(),
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

// Notifications Table
export const notificationsTable = pgTable("notifications", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id), // null means notification for all users
    type: varchar({ length: 50 }).notNull(), // 'course_created', 'semester_created', 'subject_created', 'material_uploaded'
    title: varchar({ length: 255 }).notNull(),
    message: text().notNull(),
    courseCode: varchar({ length: 50 }),
    courseName: varchar({ length: 255 }),
    semesterName: varchar({ length: 100 }),
    subjectName: varchar({ length: 255 }),
    materialTitle: varchar({ length: 255 }),
    actionUrl: varchar({ length: 500 }), // URL to navigate when clicked
    isRead: boolean().default(false),
    createdAt: timestamp().defaultNow()
});

