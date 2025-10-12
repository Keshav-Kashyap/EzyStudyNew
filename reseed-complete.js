// Clear existing data and reseed with proper semesters
require('dotenv').config();

async function clearAndReseed() {
    try {
        console.log('🧹 Clearing existing data and reseeding...');

        const { Pool } = require('pg');
        const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

        if (!connectionString) {
            throw new Error('No DATABASE_URL found');
        }

        const pool = new Pool({ connectionString });
        const client = await pool.connect();

        try {
            // Clear existing data in proper order (foreign key dependencies)
            console.log('🗑️ Clearing existing data...');
            await client.query('DELETE FROM study_materials WHERE TRUE');
            await client.query('DELETE FROM subjects WHERE TRUE');
            await client.query('DELETE FROM semesters WHERE TRUE');

            // Reset sequences
            await client.query(`
                SELECT setval(pg_get_serial_sequence('study_materials', 'id'), 1, false);
                SELECT setval(pg_get_serial_sequence('subjects', 'id'), 1, false);
                SELECT setval(pg_get_serial_sequence('semesters', 'id'), 1, false);
            `);

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
                
                ('MCA', 'Semester 3', 'Software Engineering', 'MCA301', 'SDLC and project management', true, NOW(), NOW()),
                ('MCA', 'Semester 3', 'Web Technologies', 'MCA302', 'HTML, CSS, JavaScript, PHP', true, NOW(), NOW()),
                ('MCA', 'Semester 3', 'Computer Graphics', 'MCA303', '2D and 3D graphics programming', true, NOW(), NOW()),
                ('MCA', 'Semester 3', 'Operating Systems', 'MCA304', 'OS concepts and system programming', true, NOW(), NOW()),
                
                ('MCA', 'Semester 4', 'Advanced Java', 'MCA401', 'Enterprise Java development', true, NOW(), NOW()),
                ('MCA', 'Semester 4', 'Mobile App Development', 'MCA402', 'Android and iOS development', true, NOW(), NOW()),
                ('MCA', 'Semester 4', 'Project Work', 'MCA403', 'Major project and dissertation', true, NOW(), NOW()),
                ('MCA', 'Semester 4', 'Internship', 'MCA404', 'Industrial training and exposure', true, NOW(), NOW()),
                
                -- BCA Subjects
                ('BCA', 'Semester 1', 'Computer Fundamentals', 'BCA101', 'Introduction to computers and IT', true, NOW(), NOW()),
                ('BCA', 'Semester 1', 'Programming Principles', 'BCA102', 'Basic programming concepts', true, NOW(), NOW()),
                ('BCA', 'Semester 1', 'Mathematics-I', 'BCA103', 'Algebra and calculus', true, NOW(), NOW()),
                ('BCA', 'Semester 1', 'English Communication', 'BCA104', 'Communication skills', true, NOW(), NOW()),
                
                ('BCA', 'Semester 2', 'C Programming', 'BCA201', 'C language programming', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Mathematics-II', 'BCA202', 'Statistics and discrete mathematics', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Digital Electronics', 'BCA203', 'Digital logic and circuits', true, NOW(), NOW()),
                ('BCA', 'Semester 2', 'Computer Organization', 'BCA204', 'Computer architecture basics', true, NOW(), NOW()),
                
                ('BCA', 'Semester 3', 'Data Structures', 'BCA301', 'Linear and non-linear data structures', true, NOW(), NOW()),
                ('BCA', 'Semester 3', 'Object Oriented Programming', 'BCA302', 'OOP using C++ and Java', true, NOW(), NOW()),
                ('BCA', 'Semester 3', 'Database Management', 'BCA303', 'SQL and database design', true, NOW(), NOW()),
                ('BCA', 'Semester 3', 'Web Development', 'BCA304', 'HTML, CSS, JavaScript basics', true, NOW(), NOW()),
                
                ('BCA', 'Semester 4', 'Software Engineering', 'BCA401', 'Software development lifecycle', true, NOW(), NOW()),
                ('BCA', 'Semester 4', 'Operating Systems', 'BCA402', 'OS concepts and administration', true, NOW(), NOW()),
                ('BCA', 'Semester 4', 'Computer Networks', 'BCA403', 'Network fundamentals', true, NOW(), NOW()),
                ('BCA', 'Semester 4', 'Java Programming', 'BCA404', 'Advanced Java concepts', true, NOW(), NOW()),
                
                ('BCA', 'Semester 5', 'Advanced Web Technologies', 'BCA501', 'PHP, Node.js, frameworks', true, NOW(), NOW()),
                ('BCA', 'Semester 5', 'Mobile Application Development', 'BCA502', 'Android app development', true, NOW(), NOW()),
                ('BCA', 'Semester 5', 'Data Analytics', 'BCA503', 'Data science and analytics', true, NOW(), NOW()),
                ('BCA', 'Semester 5', 'Cyber Security', 'BCA504', 'Information security basics', true, NOW(), NOW()),
                
                ('BCA', 'Semester 6', 'Project Work', 'BCA601', 'Major project development', true, NOW(), NOW()),
                ('BCA', 'Semester 6', 'Internship', 'BCA602', 'Industry training program', true, NOW(), NOW()),
                ('BCA', 'Semester 6', 'Emerging Technologies', 'BCA603', 'AI, ML, Cloud computing', true, NOW(), NOW()),
                ('BCA', 'Semester 6', 'Professional Skills', 'BCA604', 'Soft skills and interview prep', true, NOW(), NOW()),
                
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
                ('BTECH', 'Semester 2', 'Environmental Science', 'BTECH205', 'Environmental awareness', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 3', 'Object Oriented Programming', 'BTECH301', 'OOP using Java/C++', true, NOW(), NOW()),
                ('BTECH', 'Semester 3', 'Computer Organization', 'BTECH302', 'Computer architecture', true, NOW(), NOW()),
                ('BTECH', 'Semester 3', 'Database Management Systems', 'BTECH303', 'SQL and database design', true, NOW(), NOW()),
                ('BTECH', 'Semester 3', 'Discrete Mathematics', 'BTECH304', 'Mathematical foundations for CS', true, NOW(), NOW()),
                ('BTECH', 'Semester 3', 'Engineering Economics', 'BTECH305', 'Economic analysis for engineers', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 4', 'Operating Systems', 'BTECH401', 'OS concepts and system calls', true, NOW(), NOW()),
                ('BTECH', 'Semester 4', 'Computer Networks', 'BTECH402', 'Network protocols and security', true, NOW(), NOW()),
                ('BTECH', 'Semester 4', 'Software Engineering', 'BTECH403', 'SDLC and project management', true, NOW(), NOW()),
                ('BTECH', 'Semester 4', 'Theory of Computation', 'BTECH404', 'Automata and formal languages', true, NOW(), NOW()),
                ('BTECH', 'Semester 4', 'Microprocessors', 'BTECH405', '8086 and embedded systems', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 5', 'Web Technologies', 'BTECH501', 'Full-stack web development', true, NOW(), NOW()),
                ('BTECH', 'Semester 5', 'Machine Learning', 'BTECH502', 'ML algorithms and applications', true, NOW(), NOW()),
                ('BTECH', 'Semester 5', 'Compiler Design', 'BTECH503', 'Language processors', true, NOW(), NOW()),
                ('BTECH', 'Semester 5', 'Computer Graphics', 'BTECH504', '2D/3D graphics programming', true, NOW(), NOW()),
                ('BTECH', 'Semester 5', 'Elective-I', 'BTECH505', 'Specialization subject', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 6', 'Mobile App Development', 'BTECH601', 'Android and iOS development', true, NOW(), NOW()),
                ('BTECH', 'Semester 6', 'Data Science', 'BTECH602', 'Big data and analytics', true, NOW(), NOW()),
                ('BTECH', 'Semester 6', 'Cyber Security', 'BTECH603', 'Information security', true, NOW(), NOW()),
                ('BTECH', 'Semester 6', 'Cloud Computing', 'BTECH604', 'AWS, Azure, Google Cloud', true, NOW(), NOW()),
                ('BTECH', 'Semester 6', 'Elective-II', 'BTECH605', 'Advanced specialization', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 7', 'Major Project-I', 'BTECH701', 'Project planning and initial development', true, NOW(), NOW()),
                ('BTECH', 'Semester 7', 'Artificial Intelligence', 'BTECH702', 'AI concepts and applications', true, NOW(), NOW()),
                ('BTECH', 'Semester 7', 'Blockchain Technology', 'BTECH703', 'Cryptocurrency and DApps', true, NOW(), NOW()),
                ('BTECH', 'Semester 7', 'Professional Ethics', 'BTECH704', 'Engineering ethics and values', true, NOW(), NOW()),
                ('BTECH', 'Semester 7', 'Elective-III', 'BTECH705', 'Industry-specific subject', true, NOW(), NOW()),
                
                ('BTECH', 'Semester 8', 'Major Project-II', 'BTECH801', 'Project completion and presentation', true, NOW(), NOW()),
                ('BTECH', 'Semester 8', 'Internship', 'BTECH802', 'Industrial training', true, NOW(), NOW()),
                ('BTECH', 'Semester 8', 'Entrepreneurship', 'BTECH803', 'Startup and business development', true, NOW(), NOW()),
                ('BTECH', 'Semester 8', 'Seminar', 'BTECH804', 'Technical presentation skills', true, NOW(), NOW())
            `);

            // Insert study materials for each subject
            console.log('📄 Inserting study materials...');
            await client.query(`
                INSERT INTO study_materials ("subjectId", title, type, description, "fileUrl", "downloadCount", "isActive", "createdAt", "updatedAt")
                SELECT 
                    s.id,
                    s.name || ' - Lecture Notes',
                    'PDF',
                    'Comprehensive lecture notes for ' || s.name,
                    'https://example.com/materials/' || s.code || '_notes.pdf',
                    FLOOR(RANDOM() * 100) + 10,
                    true,
                    NOW(),
                    NOW()
                FROM subjects s
                UNION ALL
                SELECT 
                    s.id,
                    s.name || ' - Lab Manual',
                    'PDF',
                    'Practical lab exercises for ' || s.name,
                    'https://example.com/materials/' || s.code || '_lab.pdf',
                    FLOOR(RANDOM() * 50) + 5,
                    true,
                    NOW(),
                    NOW()
                FROM subjects s
                WHERE s.code NOT LIKE '%Project%' AND s.code NOT LIKE '%Internship%'
                UNION ALL
                SELECT 
                    s.id,
                    s.name || ' - Question Bank',
                    'PDF',
                    'Previous years question papers and solutions',
                    'https://example.com/materials/' || s.code || '_questions.pdf',
                    FLOOR(RANDOM() * 200) + 50,
                    true,
                    NOW(),
                    NOW()
                FROM subjects s
                WHERE s.code NOT LIKE '%Project%' AND s.code NOT LIKE '%Internship%'
            `);

            console.log(' Complete seeding finished successfully!');

            // Show statistics
            const semesterCount = await client.query('SELECT COUNT(*) FROM semesters');
            const subjectCount = await client.query('SELECT COUNT(*) FROM subjects');
            const materialCount = await client.query('SELECT COUNT(*) FROM study_materials');

            console.log(`📊 Data Summary:`);
            console.log(`   Semesters: ${semesterCount.rows[0].count}`);
            console.log(`   Subjects: ${subjectCount.rows[0].count}`);
            console.log(`   Study Materials: ${materialCount.rows[0].count}`);

        } finally {
            client.release();
            await pool.end();
        }

    } catch (error) {
        console.error(' Error reseeding data:', error);
        throw error;
    }
}

// Run the reseeding
clearAndReseed()
    .then(() => {
        console.log('Complete reseeding process completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error(' Reseeding process failed:', error);
        process.exit(1);
    });