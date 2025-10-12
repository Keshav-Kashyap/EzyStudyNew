import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import schemas - let's use the correct schema from config
import {
    usersTable,
    coursesTable,
    semestersTable,
    subjectsTable,
    studyMaterialsTable
} from './config/schema.jsx';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Insert sample courses
        const courseData = await db.insert(coursesTable).values([
            {
                title: 'Master of Computer Applications',
                subtitle: 'Advanced Computer Applications',
                description: 'A comprehensive 3-year program covering advanced computer applications and software development.',
                category: 'MCA',
                bgColor: 'bg-blue-500',
                documentsCount: 45,
                studentsCount: 150
            },
            {
                title: 'Bachelor of Computer Applications',
                subtitle: 'Computer Applications Fundamentals',
                description: 'A 3-year undergraduate program focusing on computer applications and programming.',
                category: 'BCA',
                bgColor: 'bg-green-500',
                documentsCount: 32,
                studentsCount: 120
            },
            {
                title: 'Bachelor of Technology',
                subtitle: 'Engineering & Technology',
                description: '4-year engineering program with specializations in various fields.',
                category: 'BTech',
                bgColor: 'bg-purple-500',
                documentsCount: 67,
                studentsCount: 200
            }
        ]).returning();

        console.log('Courses inserted:', courseData.length);

        // Insert semesters for MCA (6 semesters)
        const mcaCourse = courseData.find(c => c.category === 'MCA');
        const semesterData = [];

        for (let i = 1; i <= 6; i++) {
            semesterData.push({
                courseId: mcaCourse.id,
                name: `Semester ${i}`,
                description: `MCA Semester ${i} - Advanced topics in computer applications`
            });
        }

        const insertedSemesters = await db.insert(semestersTable).values(semesterData).returning();
        console.log('Semesters inserted:', insertedSemesters.length);

        // Insert subjects for 1st semester
        const sem1 = insertedSemesters[0];
        const subjectData = await db.insert(subjectsTable).values([
            {
                semesterId: sem1.id,
                name: 'Programming Fundamentals',
                code: 'MCA101',
                description: 'Introduction to programming concepts and C language'
            },
            {
                semesterId: sem1.id,
                name: 'Computer Organization',
                code: 'MCA102',
                description: 'Basic computer architecture and organization'
            },
            {
                semesterId: sem1.id,
                name: 'Discrete Mathematics',
                code: 'MCA103',
                description: 'Mathematical foundations for computer science'
            },
            {
                semesterId: sem1.id,
                name: 'Database Management Systems',
                code: 'MCA104',
                description: 'Introduction to database concepts and SQL'
            },
            {
                semesterId: sem1.id,
                name: 'Web Technologies',
                code: 'MCA105',
                description: 'HTML, CSS, JavaScript fundamentals'
            }
        ]).returning();

        console.log('Subjects inserted:', subjectData.length);

        // Insert study materials
        const progFundamentals = subjectData[0];
        await db.insert(studyMaterialsTable).values([
            {
                subjectId: progFundamentals.id,
                title: 'C Programming Notes - Chapter 1',
                type: 'PDF',
                fileUrl: 'https://example.com/files/c-programming-ch1.pdf',
                description: 'Comprehensive notes on C programming fundamentals',
                tags: '["programming", "c-language", "fundamentals"]',
                downloadCount: 45
            },
            {
                subjectId: progFundamentals.id,
                title: 'Programming Practice Problems',
                type: 'PDF',
                fileUrl: 'https://example.com/files/programming-problems.pdf',
                description: 'Collection of programming practice problems with solutions',
                tags: '["practice", "problems", "c-language"]',
                downloadCount: 32
            },
            {
                subjectId: progFundamentals.id,
                title: 'Lab Manual - Programming Fundamentals',
                type: 'PDF',
                fileUrl: 'https://example.com/files/lab-manual-prog.pdf',
                description: 'Complete lab manual for programming fundamentals course',
                tags: '["lab", "manual", "programming"]',
                downloadCount: 28
            }
        ]);

        console.log('Study materials inserted');

        // Insert a sample user
        await db.insert(usersTable).values([
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                credits: 10
            }
        ]);

        console.log('Sample user inserted');

        console.log(' Database seeding completed successfully!');

        // Verify by counting records
        const courseCount = await db.select().from(coursesTable);
        const semesterCount = await db.select().from(semestersTable);
        const subjectCount = await db.select().from(subjectsTable);
        const materialCount = await db.select().from(studyMaterialsTable);
        const userCount = await db.select().from(usersTable);

        console.log('📊 Final counts:');
        console.log(`   Courses: ${courseCount.length}`);
        console.log(`   Semesters: ${semesterCount.length}`);
        console.log(`   Subjects: ${subjectCount.length}`);
        console.log(`   Study Materials: ${materialCount.length}`);
        console.log(`   Users: ${userCount.length}`);

    } catch (error) {
        console.error(' Error seeding database:', error);
    }
}

// Run the seed function
seedDatabase();