import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../config/schema.jsx'

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

async function migrate() {
    try {
        console.log('🚀 Starting database migration...')

        // Create admin_courses table
        await sql`
      CREATE TABLE IF NOT EXISTS admin_courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        duration INTEGER NOT NULL,
        total_semesters INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
        console.log('✅ admin_courses table created')

        // Create admin_semesters table
        await sql`
      CREATE TABLE IF NOT EXISTS admin_semesters (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES admin_courses(id) ON DELETE CASCADE,
        semester_number INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_id, semester_number)
      )
    `
        console.log('✅ admin_semesters table created')

        // Create admin_subjects table
        await sql`
      CREATE TABLE IF NOT EXISTS admin_subjects (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES admin_courses(id) ON DELETE CASCADE,
        semester_id INTEGER NOT NULL REFERENCES admin_semesters(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        subject_code VARCHAR(50),
        credits INTEGER DEFAULT 3,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
        console.log('✅ admin_subjects table created')

        // Create admin_materials table
        await sql`
      CREATE TABLE IF NOT EXISTS admin_materials (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES admin_courses(id) ON DELETE CASCADE,
        semester_id INTEGER NOT NULL REFERENCES admin_semesters(id) ON DELETE CASCADE,
        subject_id INTEGER NOT NULL REFERENCES admin_subjects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_url VARCHAR(500),
        file_type VARCHAR(50),
        cloudinary_public_id VARCHAR(255),
        file_size INTEGER,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
        console.log('✅ admin_materials table created')

        // Insert sample data
        const sampleCourse = await sql`
      INSERT INTO admin_courses (name, code, description, duration, total_semesters)
      VALUES ('Computer Science Engineering', 'CSE', 'Complete CS program with all semesters', 4, 8)
      ON CONFLICT DO NOTHING
      RETURNING id
    `

        if (sampleCourse.rows.length > 0) {
            const courseId = sampleCourse.rows[0].id

            // Insert sample semesters
            await sql`
        INSERT INTO admin_semesters (course_id, semester_number, name, description)
        VALUES 
          (${courseId}, 1, 'Semester 1', 'Foundation courses'),
          (${courseId}, 2, 'Semester 2', 'Core programming concepts')
        ON CONFLICT DO NOTHING
      `;

            console.log('✅ Sample data inserted')
        }

        console.log('🎉 Database migration completed successfully!')
        console.log('\n📋 Next steps:')
        console.log('1. Add Cloudinary environment variables')
        console.log('2. Make a user admin in Clerk dashboard')
        console.log('3. Start uploading courses and materials!')

    } catch (error) {
        console.error('❌ Migration failed:', error)
    }
}

migrate()