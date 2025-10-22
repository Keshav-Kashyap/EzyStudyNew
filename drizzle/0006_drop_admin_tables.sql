-- Drop admin tables migration
-- These tables are no longer needed as admin uses main tables

-- Drop admin_materials table
DROP TABLE IF EXISTS "admin_materials" CASCADE;

-- Drop admin_subjects table  
DROP TABLE IF EXISTS "admin_subjects" CASCADE;

-- Drop admin_semesters table
DROP TABLE IF EXISTS "admin_semesters" CASCADE;

-- Drop admin_courses table
DROP TABLE IF EXISTS "admin_courses" CASCADE;