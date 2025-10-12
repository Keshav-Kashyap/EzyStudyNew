// Simple seed script using environment variables
require('dotenv').config();

async function seedDefaultData() {
    try {
        console.log('🌱 Starting to seed default data...');

        // Try to import pg
        let pool;
        try {
            const { Pool } = require('pg');
            const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

            if (!connectionString) {
                throw new Error('No DATABASE_URL found');
            }

            pool = new Pool({ connectionString });
        } catch (err) {
            console.log('⚠️ pg not available, trying direct API approach...');
            return await seedViaAPI();
        }

        const client = await pool.connect();

        try {
            // Check if semesters already exist
            const existingSemesters = await client.query(`
                SELECT COUNT(*) FROM semesters 
                WHERE category IN ('MCA', 'BCA', 'BTECH')
            `);

            if (existingSemesters.rows[0].count > 0) {
                console.log(`⚠️ Found ${existingSemesters.rows[0].count} existing semesters. Skipping seed.`);
                return;
            }

            // Insert semesters first
            console.log('🏫 Inserting semesters...');
            await client.query(`
                INSERT INTO semesters (category, name, description, "isActive", "createdAt", "updatedAt") VALUES
                -- MCA Semesters (2 years = 4 semesters)
                ('MCA', 'Semester 1', 'First semester of MCA program', true, NOW(), NOW()),
                ('MCA', 'Semester 2', 'Second semester of MCA program', true, NOW(), NOW()),
                ('MCA', 'Semester 3', 'Third semester of MCA program', true, NOW(), NOW()),
                ('MCA', 'Semester 4', 'Fourth semester of MCA program', true, NOW(), NOW()),
                
                -- BCA Semesters (3 years = 6 semesters)
                ('BCA', 'Semester 1', 'First semester of BCA program', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Second semester of BCA program', true, NOW(), NOW()),
                ('BCA', 'Semester 3', 'Third semester of BCA program', true, NOW(), NOW()),
                ('BCA', 'Semester 4', 'Fourth semester of BCA program', true, NOW(), NOW()),
                ('BCA', 'Semester 5', 'Fifth semester of BCA program', true, NOW(), NOW()),
                ('BCA', 'Semester 6', 'Sixth semester of BCA program', true, NOW(), NOW()),
                
                -- BTECH Semesters (4 years = 8 semesters)
                ('BTECH', 'Semester 1', 'First semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 2', 'Second semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 3', 'Third semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 4', 'Fourth semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 5', 'Fifth semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 6', 'Sixth semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 7', 'Seventh semester of BTECH program', true, NOW(), NOW()),
                ('BTECH', 'Semester 8', 'Eighth semester of BTECH program', true, NOW(), NOW())
            `);

            // Insert subjects for each semester
            console.log(' Inserting subjects...');
            await client.query(`
                INSERT INTO subjects (category, "semesterName", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
                -- MCA Subjects
                ('MCA', 'Semester 1', 'Computer Fundamentals', 'MCA101', 'Basic computer concepts and hardware', true, NOW(), NOW()),
                ('MCA', 'Semester 1', 'Programming in C', 'MCA102', 'C programming fundamentals', true, NOW(), NOW()),
                ('MCA', 'Semester 1', 'Mathematics for Computing', 'MCA103', 'Mathematical foundations for computing', true, NOW(), NOW()),
                ('MCA', 'Semester 1', 'Digital Electronics', 'MCA104', 'Digital circuits and logic design', true, NOW(), NOW()),
                
                ('MCA', 'Semester 2', 'Data Structures', 'MCA201', 'Arrays, linked lists, stacks, queues', true, NOW(), NOW()),
                ('MCA', 'Semester 2', 'Object Oriented Programming', 'MCA202', 'OOP concepts using Java/C++', true, NOW(), NOW()),
                ('MCA', 'Semester 2', 'Database Management Systems', 'MCA203', 'SQL and database design', true, NOW(), NOW()),
                ('MCA', 'Semester 2', 'Computer Networks', 'MCA204', 'Network protocols and architecture', true, NOW(), NOW()),
                
                -- BCA Subjects
                ('BCA', 'Semester 1', 'Computer Fundamentals', 'BCA101', 'Introduction to computers and IT', true, NOW(), NOW()),
                ('BCA', 'Semester 1', 'Programming Principles', 'BCA102', 'Basic programming concepts', true, NOW(), NOW()),
                ('BCA', 'Semester 1', 'Mathematics-I', 'BCA103', 'Algebra and calculus', true, NOW(), NOW()),
                ('BCA', 'Semester 1', 'English Communication', 'BCA104', 'Communication skills', true, NOW(), NOW()),
                
                ('BCA', 'Semester 2', 'C Programming', 'BCA201', 'C language programming', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Mathematics-II', 'BCA202', 'Statistics and discrete mathematics', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Digital Electronics', 'BCA203', 'Digital logic and circuits', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Computer Organization', 'BCA204', 'Computer architecture basics', true, NOW(), NOW()),
                
                -- BTECH Subjects
                ('BTECH', 'Semester 1', 'Engineering Mathematics-I', 'BTECH101', 'Calculus and differential equations', true, NOW(), NOW()),
                ('BTECH', 'Semester 1', 'Engineering Physics', 'BTECH102', 'Applied physics for engineers', true, NOW(), NOW()),
                ('BTECH', 'Semester 1', 'Engineering Chemistry', 'BTECH103', 'Applied chemistry concepts', true, NOW(), NOW()),
                ('BTECH', 'Semester 1', 'Programming for Problem Solving', 'BTECH104', 'C programming and algorithms', true, NOW(), NOW()),
                ('BTECH', 'Semester 1', 'Engineering Graphics', 'BTECH105', 'Technical drawing and CAD', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 2', 'Engineering Mathematics-II', 'BTECH201', 'Linear algebra and complex analysis', true, NOW(), NOW()),
                ('BTECH', 'Semester 2', 'Data Structures and Algorithms', 'BTECH202', 'Advanced data structures', true, NOW(), NOW()),
                ('BTECH', 'Semester 2', 'Digital Logic Design', 'BTECH203', 'Digital circuits and VHDL', true, NOW(), NOW()),
                ('BTECH', 'Semester 2', 'Basic Electrical Engineering', 'BTECH204', 'Electrical circuits and machines', true, NOW(), NOW()),
                ('BTECH', 'Semester 2', 'Environmental Science', 'BTECH205', 'Environmental awareness', true, NOW(), NOW())
            `);            // Insert study materials
            console.log('📄 Inserting study materials...');
            await client.query(`
                INSERT INTO study_materials ("subjectId", title, type, description, "fileUrl", "downloadCount", "isActive", "createdAt", "updatedAt")
                SELECT 
                    s.id,
                    s.name || ' - Lecture Notes',
                    'PDF',
                    'Sample study material',
                    'https://example.com/materials/' || s.code || '_notes.pdf',
                    25,
                    true,
                    NOW(),
                    NOW()
                FROM subjects s
                WHERE s.code LIKE 'MCA%' OR s.code LIKE 'BCA%' OR s.code LIKE 'BTECH%'
            `);

            console.log(' Seeding completed successfully!');

        } finally {
            client.release();
            await pool.end();
        }

    } catch (error) {
        console.error(' Error seeding data:', error);
        throw error;
    }
}

async function seedViaAPI() {
    console.log('🌐 Trying API approach...');
    // Fallback to manual data if API not available
    console.log('📝 Please manually run the SQL script: seed-data.sql');
    console.log('🔧 Or start the development server and visit: /admin/seed-data');
}

// Run the seeding
seedDefaultData()
    .then(() => {
        console.log('Process completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error(' Process failed:', error);
        process.exit(1);
    });