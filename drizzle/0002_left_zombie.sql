-- Custom migration to add courseCategory and migrate data
-- Step 1: Add nullable courseCategory column
ALTER TABLE "semesters" ADD COLUMN "courseCategory" text;

-- Step 2: Update courseCategory with course data
UPDATE "semesters" 
SET "courseCategory" = (
    SELECT "category" 
    FROM "courses" 
    WHERE "courses"."id" = "semesters"."courseId"
);

-- Step 3: Make courseCategory NOT NULL after data is populated
ALTER TABLE "semesters" ALTER COLUMN "courseCategory" SET NOT NULL;

-- Step 4: Drop the foreign key constraint
ALTER TABLE "semesters" DROP CONSTRAINT IF EXISTS "semesters_courseId_courses_id_fk";

-- Step 5: Drop the courseId column
ALTER TABLE "semesters" DROP COLUMN "courseId";