import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/admin-auth";
import { db } from "@/config/db";
import { coursesTable, semestersTable } from '@/config/schema';
import { eq } from "drizzle-orm";

export async function GET(request) {
    try {
        const adminCheck = await checkAdminAccess();

        if (!adminCheck.isAuthenticated || !adminCheck.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Admin access required"
            }, { status: 403 });
        }

        // Get all courses
        const courses = await db.select().from(coursesTable);

        // Get semesters for each course
        const coursesWithSemesters = await Promise.all(
            courses.map(async (course) => {
                const semesters = await db
                    .select()
                    .from(semestersTable)
                    .where(eq(semestersTable.category, course.category));

                return {
                    id: course.id,
                    name: course.name,
                    category: course.category,
                    semesters: semesters.map(sem => ({
                        id: sem.id,
                        name: sem.name,
                        isActive: sem.isActive
                    }))
                };
            })
        );

        return NextResponse.json({
            success: true,
            courses: coursesWithSemesters
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch courses",
            details: error.message
        }, { status: 500 });
    }
}
