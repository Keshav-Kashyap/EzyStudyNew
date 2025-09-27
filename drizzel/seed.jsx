// src/drizzle/seed.ts
import { db } from "@/config/db";
import { courses, semesters, subjects, resources } from "@/drizzle/schema";

async function seed() {
    // Insert course
    const insertedCourse = await db.insert(courses).values({
        code: "mca",
        name: "Master of Computer Applications",
        description: "MCA full details",
    }).returning();

    const courseId = insertedCourse[0].id;

    // Insert semester 1
    const insertedSem = await db.insert(semesters).values({
        courseId,
        semesterNumber: 1,
        totalSubjects: 2,
    }).returning();

    const semId = insertedSem[0].id;

    // Insert subjects
    const [s1] = await db.insert(subjects).values({
        semesterId: semId,
        name: "Data Structures",
        code: "MCA101"
    }).returning();

    const [s2] = await db.insert(subjects).values({
        semesterId: semId,
        name: "Discrete Mathematics",
        code: "MCA102"
    }).returning();

    // Insert resources (fileUrl -> store actual file in S3/Supabase and put URL here)
    await db.insert(resources).values({
        subjectId: s1.id,
        title: "Data Structures - Notes",
        fileUrl: "https://storage.example.com/mca/sem1/ds.pdf"
    });

    await db.insert(resources).values({
        subjectId: s2.id,
        title: "Discrete Maths - Notes",
        fileUrl: "https://storage.example.com/mca/sem1/dm.pdf"
    });

    console.log("Seed done");
    process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
