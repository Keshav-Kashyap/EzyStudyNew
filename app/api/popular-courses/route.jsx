import { db } from "@/config/db";
import { coursesTable, semestersTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

export async function GET() {
    try {
        // Fetch courses with material count and student count
        const courses = await db
            .select({
                id: coursesTable.id,
                title: coursesTable.title,
                category: coursesTable.category,
                code: coursesTable.code,
                description: coursesTable.description,
                image: coursesTable.image,
                duration: coursesTable.duration,
                bgColor: coursesTable.bgColor,
                createdAt: coursesTable.createdAt,
            })
            .from(coursesTable)
            .limit(10);

        // For each course, get semester count and total materials
        const coursesWithStats = await Promise.all(
            courses.map(async (course) => {
                // Get semester count
                const semesters = await db
                    .select()
                    .from(semestersTable)
                    .where(eq(semestersTable.categoryId, course.id));

                // Get total materials count across all semesters
                const semesterIds = semesters.map(s => s.id);
                let totalMaterials = 0;

                if (semesterIds.length > 0) {
                    const materialsCount = await db
                        .select({
                            count: sql`count(*)`,
                        })
                        .from(studyMaterialsTable)
                        .where(sql`${studyMaterialsTable.semesterId} IN (${sql.join(semesterIds, sql`, `)})`);

                    totalMaterials = Number(materialsCount[0]?.count || 0);
                }

                return {
                    ...course,
                    semesters: semesters.length,
                    totalMaterials: totalMaterials,
                    students: Math.floor(totalMaterials * 3.5) + Math.floor(Math.random() * 100), // Estimated students
                };
            })
        );

        // Sort by total materials (most popular first)
        const popularCourses = coursesWithStats
            .sort((a, b) => b.totalMaterials - a.totalMaterials)
            .slice(0, 3); // Top 3 popular courses

        return NextResponse.json({
            success: true,
            courses: popularCourses,
        });
    } catch (error) {
        console.error("Error fetching popular courses:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch popular courses",
            },
            { status: 500 }
        );
    }
}
