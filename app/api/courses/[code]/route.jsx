import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(request, { params }) {
    try {
        const { code } = await params;

        // Find course by category/code
        const courses = await db.select().from(coursesTable)
            .where(eq(coursesTable.category, code.toUpperCase()));

        if (courses.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Course not found"
            }, { status: 404 });
        }

        const course = courses[0];

        // Get semesters for this course category
        const semesters = await db.select().from(semestersTable)
            .where(eq(semestersTable.category, course.category));

        // Get subjects for each semester
        const semestersWithSubjects = await Promise.all(
            semesters.map(async (semester) => {
                const subjects = await db.select().from(subjectsTable)
                    .where(and(
                        eq(subjectsTable.category, course.category),
                        eq(subjectsTable.semesterName, semester.name)
                    ));

                // Get study materials for each subject
                const subjectsWithMaterials = await Promise.all(
                    subjects.map(async (subject) => {
                        const materials = await db.select().from(studyMaterialsTable)
                            .where(eq(studyMaterialsTable.subjectId, subject.id));

                        return {
                            ...subject,
                            materials
                        };
                    })
                );

                return {
                    ...semester,
                    subjects: subjectsWithMaterials
                };
            })
        );

        // Calculate totals
        const totalSubjects = semestersWithSubjects.reduce((sum, sem) => sum + sem.subjects.length, 0);
        const totalMaterials = semestersWithSubjects.reduce((sum, sem) =>
            sum + sem.subjects.reduce((subSum, sub) => subSum + sub.materials.length, 0), 0
        );

        return NextResponse.json({
            success: true,
            course: {
                ...course,
                semesters: semestersWithSubjects,
                stats: {
                    totalSemesters: semesters.length,
                    totalSubjects,
                    totalMaterials
                }
            }
        });

    } catch (error) {
        console.error(' Error fetching course details:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch course details",
            details: error.message
        }, { status: 500 });
    }
}