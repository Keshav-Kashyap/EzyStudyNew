import { db } from "@/config/db";
import { adminSubjects, adminSemesters, adminCourses } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET - Get all subjects
export async function GET() {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const allSubjects = await db.select().from(adminSubjects);
        return NextResponse.json({
            success: true,
            subjects: allSubjects
        });
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch subjects"
        }, { status: 500 });
    }
}

// POST - Add subject to semester
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
        const {
            courseId,
            semesterId,
            name,
            code,
            description,
            credits
        } = body;

        if (!courseId || !semesterId || !name || !code || !credits) {
            return NextResponse.json({
                success: false,
                error: "Course ID, semester ID, name, code, and credits are required"
            }, { status: 400 });
        }

        // Verify semester exists
        const semester = await db.select().from(adminSemesters)
            .where(eq(adminSemesters.id, parseInt(semesterId)));

        if (semester.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Semester not found"
            }, { status: 404 });
        }

        // Create new subject
        const newSubject = await db.insert(adminSubjects).values({
            courseId: parseInt(courseId),
            semesterId: parseInt(semesterId),
            name,
            code: code.toUpperCase(),
            description: description || `Comprehensive study of ${name}`,
            credits: parseInt(credits),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Subject added successfully",
            subject: newSubject[0]
        });

    } catch (error) {
        console.error('❌ Error adding subject:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to add subject",
            details: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete subject
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
                error: "Subject ID is required"
            }, { status: 400 });
        }

        await db.delete(adminSubjects).where(eq(adminSubjects.id, parseInt(id)));

        return NextResponse.json({
            success: true,
            message: "Subject deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting subject:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to delete subject"
        }, { status: 500 });
    }
}

