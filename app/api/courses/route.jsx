import { db, withRetry } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and, count } from "drizzle-orm";

export async function GET() {
    try {
        // Fetch all courses with retry logic
        const courses = await withRetry(async () => {
            return await db.select().from(coursesTable);
        });

        // For each course, get additional statistics
        const coursesWithStats = await Promise.all(
            courses.map(async (course) => {
                try {
                    // Count semesters for this course category
                    const semesters = await withRetry(async () => {
                        return await db.select().from(semestersTable)
                            .where(eq(semestersTable.category, course.category));
                    });

                    // Count total subjects across all semesters
                    let totalSubjects = 0;
                    let totalMaterials = 0;

                    for (const semester of semesters) {
                        const subjects = await withRetry(async () => {
                            return await db.select().from(subjectsTable)
                                .where(and(
                                    eq(subjectsTable.category, course.category),
                                    eq(subjectsTable.semesterName, semester.name)
                                ));
                        });
                        totalSubjects += subjects.length;

                        // Count materials for each subject through mapping table
                        for (const subject of subjects) {
                            const [result] = await withRetry(async () => {
                                return await db
                                    .select({ count: count() })
                                    .from(materialSubjectMappingTable)
                                    .where(eq(materialSubjectMappingTable.subjectId, subject.id));
                            });
                            totalMaterials += result.count;
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
                } catch (error) {
                    console.error(`Error processing course ${course.id}:`, error);
                    // Return course with default stats if there's an error
                    return {
                        ...course,
                        semesters: 0,
                        totalSubjects: 0,
                        totalMaterials: 0,
                        duration: course.category === 'MCA' ? '2 Years' :
                            course.category === 'BCA' ? '3 Years' :
                                course.category === 'BTech' ? '4 Years' : '3 Years'
                    };
                }
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

