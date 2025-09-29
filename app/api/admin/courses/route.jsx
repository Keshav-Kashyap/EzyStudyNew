import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { adminCourses } from '@/config/schema'
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const allCourses = await db.select().from(adminCourses);
        return NextResponse.json({
            success: true,
            courses: allCourses
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch courses"
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const body = await request.json();
        const { name, code, description, duration, totalSemesters } = body;

        if (!name || !code || !duration) {
            return NextResponse.json({
                success: false,
                error: "Name, code, and duration are required"
            }, { status: 400 });
        }

        const newCourse = await db.insert(adminCourses).values({
            name,
            code: code.toLowerCase(),
            description,
            duration: parseInt(duration),
            totalSemesters: totalSemesters ? parseInt(totalSemesters) : null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();

        return NextResponse.json({
            success: true,
            course: newCourse[0],
            message: "Course created successfully"
        });
    } catch (error) {
        console.error("Error creating course:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to create course"
        }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                error: "Course ID is required"
            }, { status: 400 });
        }

        await db.delete(adminCourses).where(eq(adminCourses.id, id));

        return NextResponse.json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to delete course"
        }, { status: 500 });
    }
}