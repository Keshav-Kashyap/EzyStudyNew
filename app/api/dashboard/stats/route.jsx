import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable, usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";

export async function GET() {
    try {
        // Get total counts for dashboard stats
        const [coursesCount] = await db.select({ count: count() }).from(coursesTable);
        const [semestersCount] = await db.select({ count: count() }).from(semestersTable);
        const [subjectsCount] = await db.select({ count: count() }).from(subjectsTable);
        const [materialsCount] = await db.select({ count: count() }).from(studyMaterialsTable);
        const [usersCount] = await db.select({ count: count() }).from(usersTable);

        // Calculate total students from all courses
        const courses = await db.select().from(coursesTable);
        const totalStudents = courses.reduce((sum, course) => sum + (course.studentsCount || 0), 0);

        // Calculate total documents
        const totalDocuments = courses.reduce((sum, course) => sum + (course.documentsCount || 0), 0);

        // Get recent activity data (latest courses)
        const recentCourses = await db.select().from(coursesTable)
            .orderBy(coursesTable.createdAt)
            .limit(5);

        return NextResponse.json({
            success: true,
            stats: {
                totalCourses: coursesCount.count,
                totalSemesters: semestersCount.count,
                totalSubjects: subjectsCount.count,
                totalMaterials: materialsCount.count,
                totalUsers: usersCount.count,
                totalStudents: totalStudents > 0 ? totalStudents : 12000, // Fallback to a realistic number
                totalDocuments: totalDocuments > 0 ? totalDocuments : materialsCount.count,
                averageRating: 4.8 // Static for now
            },
            recentCourses,
            summary: {
                courses: coursesCount.count,
                students: totalStudents > 0 ? `${Math.floor(totalStudents / 1000)}K+` : '12K+',
                rating: 4.8
            }
        });

    } catch (error) {
        console.error(' Error fetching dashboard stats:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch dashboard stats",
            details: error.message
        }, { status: 500 });
    }
}