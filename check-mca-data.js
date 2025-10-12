const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { integer, pgTable, varchar, text, serial, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq } = require('drizzle-orm');
require('dotenv').config();

// Define schemas inline
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

async function checkMCAData() {
    try {
        console.log('🔍 Checking MCA course data...\n');

        // Get MCA course
        const mcaCourses = await db.select().from(coursesTable)
            .where(eq(coursesTable.category, 'MCA'));

        if (mcaCourses.length === 0) {
            console.log('No MCA course found!');
            return;
        }

        const mcaCourse = mcaCourses[0];
        console.log('MCA Course found:', {
            id: mcaCourse.id,
            title: mcaCourse.title,
            category: mcaCourse.category,
            studentsCount: mcaCourse.studentsCount
        });

        // Get semesters for MCA
        const semesters = await db.select().from(semestersTable)
            .where(eq(semestersTable.courseId, mcaCourse.id));

        console.log(`\nSemesters found: ${semesters.length}`);
        for (const semester of semesters) {
            console.log(`  - ${semester.name} (ID: ${semester.id})`);

            // Get subjects for this semester
            const subjects = await db.select().from(subjectsTable)
                .where(eq(subjectsTable.semesterId, semester.id));

            console.log(`  Subjects: ${subjects.length}`);
            for (const subject of subjects) {
                console.log(` • ${subject.name} (${subject.code})`);

                // Get materials for this subject
                const materials = await db.select().from(studyMaterialsTable)
                    .where(eq(studyMaterialsTable.subjectId, subject.id));

                console.log(`  Materials: ${materials.length}`);
                materials.forEach(material => {
                    console.log(`          - ${material.title} (${material.type})`);
                });
            }
        }

        console.log('\n Data verification complete!');

    } catch (error) {
        console.error(' Error checking MCA data:', error);
    }
}

checkMCAData();