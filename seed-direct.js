const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { integer, pgTable, varchar, text, serial, timestamp, boolean } = require("drizzle-orm/pg-core");
require('dotenv').config();

// Define schemas inline to match the actual database schema
const coursesTable = pgTable("courses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    subtitle: varchar({ length: 255 }),
    description: text(),
    category: varchar({ length: 100 }).notNull(),
    image: varchar({ length: 255 }),
    bgColor: varchar({ length: 100 }),
    isActive: boolean().default(true),
    documentsCount: integer().default(0),
    studentsCount: integer().default(0),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

const semestersTable = pgTable("semesters", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer().references(() => coursesTable.id),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

const subjectsTable = pgTable("subjects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    semesterId: integer().references(() => semestersTable.id),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 50 }),
    description: text(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

const studyMaterialsTable = pgTable("study_materials", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer().references(() => subjectsTable.id),
    title: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 50 }).notNull(),
    fileUrl: varchar({ length: 500 }),
    description: text(),
    tags: text(),
    downloadCount: integer().default(0),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});

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

        console.log('✅ Courses inserted:', courseData.length);

        // Insert semesters for MCA course (6 semesters)
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
        console.log('✅ Semesters inserted:', insertedSemesters.length);

        // Insert sample subjects for MCA 1st semester
        const mcaSem1 = insertedSemesters[0]; // First semester

        if (mcaSem1) {
            const subjectData = await db.insert(subjectsTable).values([
                {
                    semesterId: mcaSem1.id,
                    name: 'Programming Fundamentals',
                    code: 'MCA101',
                    description: 'Introduction to programming concepts and C language'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Computer Organization',
                    code: 'MCA102',
                    description: 'Basic computer architecture and organization'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Discrete Mathematics',
                    code: 'MCA103',
                    description: 'Mathematical foundations for computer science'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Database Management Systems',
                    code: 'MCA104',
                    description: 'Introduction to database concepts and SQL'
                },
                {
                    semesterId: mcaSem1.id,
                    name: 'Web Technologies',
                    code: 'MCA105',
                    description: 'HTML, CSS, JavaScript fundamentals'
                }
            ]).returning();

            console.log('✅ Subjects inserted:', subjectData.length);

            // Insert sample study materials for Programming Fundamentals
            const progFundamentals = subjectData.find(s => s.code === 'MCA101');
            if (progFundamentals) {
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

                console.log('✅ Study materials inserted for Programming Fundamentals');
            }
        }

        // Verify the seeding
        const finalCourseCount = await db.select().from(coursesTable);
        const finalSemesterCount = await db.select().from(semestersTable);
        const finalSubjectCount = await db.select().from(subjectsTable);
        const finalMaterialCount = await db.select().from(studyMaterialsTable);

        console.log('🎉 Database seeding completed successfully!');
        console.log('📊 Final counts:');
        console.log(`   Courses: ${finalCourseCount.length}`);
        console.log(`   Semesters: ${finalSemesterCount.length}`);
        console.log(`   Subjects: ${finalSubjectCount.length}`);
        console.log(`   Study Materials: ${finalMaterialCount.length}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();