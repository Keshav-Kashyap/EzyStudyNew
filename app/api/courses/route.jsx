import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
    try {
        // Fetch all courses with related data
        const courses = await db.select().from(coursesTable);

        // For each course, get additional statistics
        const coursesWithStats = await Promise.all(
            courses.map(async (course) => {
                // Count semesters for this course category
                const semesters = await db.select().from(semestersTable)
                    .where(eq(semestersTable.category, course.category));

                // Count total subjects across all semesters
                let totalSubjects = 0;
                let totalMaterials = 0;

                for (const semester of semesters) {
                    const subjects = await db.select().from(subjectsTable)
                        .where(and(
                            eq(subjectsTable.category, course.category),
                            eq(subjectsTable.semesterName, semester.name)
                        ));
                    totalSubjects += subjects.length;

                    // Count materials for each subject
                    for (const subject of subjects) {
                        const materials = await db.select().from(studyMaterialsTable)
                            .where(eq(studyMaterialsTable.subjectId, subject.id));
                        totalMaterials += materials.length;
                    }
                }

                return {
                    ...course,
                    semesters: semesters.length,
                    totalSubjects,
                    totalMaterials,
                    duration: course.category === 'MCA' ? '2 Years' :
                        course.category === 'BCA' ? '3 Years' :
                            course.category === 'BTech' ? '4 Years' : '3 Years'
                };
            })
        );

        return NextResponse.json({
            success: true,
            courses: coursesWithStats
        });

    } catch (error) {
        console.error(' Error fetching courses:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch courses",
            details: error.message
        }, { status: 500 });
    }
}