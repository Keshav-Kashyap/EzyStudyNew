DROP TABLE "admin_courses" CASCADE;--> statement-breakpoint
DROP TABLE "admin_materials" CASCADE;--> statement-breakpoint
DROP TABLE "admin_semesters" CASCADE;--> statement-breakpoint
DROP TABLE "admin_subjects" CASCADE;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "duration" integer DEFAULT 3;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "studentsCount";