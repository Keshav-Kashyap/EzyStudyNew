-- Add Syllabus Table
CREATE TABLE IF NOT EXISTS "syllabus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "syllabus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category" text NOT NULL,
	"year" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"fileUrl" varchar(500) NOT NULL,
	"imageUrl" text,
	"uploadedBy" varchar(255),
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);

-- Make type column optional in study_materials
ALTER TABLE "study_materials" ALTER COLUMN "type" DROP NOT NULL;

-- Add comments for clarity
COMMENT ON TABLE "syllabus" IS 'Stores course syllabus files that can be shared across multiple semesters in integrated courses';
COMMENT ON COLUMN "syllabus"."category" IS 'Course category like MCA Integrated, BCA, etc.';
COMMENT ON COLUMN "syllabus"."year" IS 'Academic year (1st year, 2nd year, etc.)';
COMMENT ON COLUMN "syllabus"."imageUrl" IS 'Optional thumbnail image for syllabus';
COMMENT ON COLUMN "study_materials"."imageUrl" IS 'Optional custom image that admin can upload';
COMMENT ON COLUMN "study_materials"."type" IS 'Optional material type (PDF, DOC, VIDEO, etc.)';
