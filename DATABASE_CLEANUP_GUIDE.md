# 🗑️ Admin Tables Cleanup Guide

## Problem
Your database still contains admin tables that are no longer needed:
- `admin_courses`
- `admin_semesters` 
- `admin_subjects`
- `admin_materials`

## Solutions

### Option 1: Setup Database Connection & Run Script

1. **Create `.env` file** in your project root:
   ```bash
   DATABASE_URL="your_neon_database_connection_string"
   ```

2. **Run the cleanup script**:
   ```bash
   node scripts/drop-admin-tables-direct.mjs
   ```

### Option 2: Manual Database Cleanup

If you have access to your database (Neon, PostgreSQL, etc.), run these SQL commands:

```sql
-- Drop admin tables (these are no longer needed)
DROP TABLE IF EXISTS "admin_courses" CASCADE;
DROP TABLE IF EXISTS "admin_semesters" CASCADE; 
DROP TABLE IF EXISTS "admin_subjects" CASCADE;
DROP TABLE IF EXISTS "admin_materials" CASCADE;
```

### Option 3: Use Database Studio/Admin Panel

1. **Open your database management tool** (Neon Console, pgAdmin, etc.)
2. **Find and delete these tables**:
   - `admin_courses`
   - `admin_semesters`
   - `admin_subjects` 
   - `admin_materials`

## ✅ After Cleanup

Your database will only have the main tables:
- `courses` - Used by both admin and students
- `semesters` - Used by both admin and students  
- `subjects` - Used by both admin and students
- `study_materials` - Used by both admin and students
- `users` - For authentication and roles
- `notifications` - For system notifications

## Why This Cleanup?

- **No duplicate data**: Admin and students use same tables
- **Simpler architecture**: One source of truth for all data
- **Better performance**: Fewer tables to maintain
- **Easier development**: No need to sync data between admin and main tables

## Current Status

✅ **Code cleanup completed** - All API routes now use main tables  
⚠️ **Database cleanup pending** - Admin tables still exist in database but are not used

The application will work perfectly even with admin tables in database, but cleaning them up is recommended for a clean database structure.