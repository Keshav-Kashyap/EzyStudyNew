import { db, withRetry } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and, count } from "drizzle-orm";

export async function GET(request) {
    try {
        // Get pagination params from query
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const offset = (page - 1) * limit;

        // Get total count of courses
        const [{ total }] = await withRetry(async () => {
            return await db
                .select({ total: count() })
                .from(coursesTable);
        });

        // Fetch paginated courses with retry logic
        const courses = await withRetry(async () => {
            return await db.select()
                .from(coursesTable)
                .limit(limit)
                .offset(offset);
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

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            courses: coursesWithStats,
            pagination: {
                currentPage: page,
                limit,
                totalCourses: total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
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