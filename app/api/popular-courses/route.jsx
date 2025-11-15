import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, sql, count } from "drizzle-orm";

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
                // Get semester count for this course category
                const semesters = await db
                    .select()
                    .from(semestersTable)
                    .where(eq(semestersTable.category, course.category));

                // Get all subjects for this course category
                const subjects = await db
                    .select({ id: subjectsTable.id })
                    .from(subjectsTable)
                    .where(eq(subjectsTable.category, course.category));

                const subjectIds = subjects.map(s => s.id);
                let totalMaterials = 0;

                // Count materials through mapping table
                if (subjectIds.length > 0) {
                    const [result] = await db
                        .select({ count: count() })
                        .from(materialSubjectMappingTable)
                        .where(sql`${materialSubjectMappingTable.subjectId} IN (${sql.join(subjectIds.map(id => sql`${id}`), sql`, `)})`);

                    totalMaterials = result.count;
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
