-- Safe migration for subjects table
-- Step 1: Add new columns (nullable first)
ALTER TABLE "subjects" ADD COLUMN "courseCategory" text;
ALTER TABLE "subjects" ADD COLUMN "semesterName" varchar(100);

-- Step 2: Populate new columns with data from related tables
UPDATE "subjects" 
SET "courseCategory" = (
    SELECT s.course_category 
    FROM "semesters" s 
    WHERE s.id = "subjects"."semesterId"
),
"semesterName" = (
    SELECT s.name 
    FROM "semesters" s 
    WHERE s.id = "subjects"."semesterId"
);

-- Step 3: Make columns NOT NULL after data is populated
ALTER TABLE "subjects" ALTER COLUMN "courseCategory" SET NOT NULL;
ALTER TABLE "subjects" ALTER COLUMN "semesterName" SET NOT NULL;

-- Step 4: Drop foreign key constraint
ALTER TABLE "subjects" DROP CONSTRAINT IF EXISTS "subjects_semesterId_semesters_id_fk";

-- Step 5: Drop old column
ALTER TABLE "subjects" DROP COLUMN "semesterId";