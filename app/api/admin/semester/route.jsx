import { db } from "@/config/db";
import { semestersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, courseCategory } = body;

        // Validation
        if (!name || !description || !courseCategory) {
            return NextResponse.json({
                success: false,
                error: "All fields are required"
            }, { status: 400 });
        }

        // Convert category to uppercase to match database
        const category = courseCategory.toUpperCase();

        // Check if semester already exists
        const existing = await db
            .select()
            .from(semestersTable)
            .where(
                and(
                    eq(semestersTable.category, category),
                    eq(semestersTable.name, name)
                )
            );

        if (existing.length > 0) {
            return NextResponse.json({
                success: false,
                error: "Semester with this name already exists for this course"
            }, { status: 409 });
        }

        // Insert new semester
        const newSemester = await db.insert(semestersTable).values({
            category: category,
            name: name,
            description: description,
            isActive: true
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Semester created successfully",
            semester: newSemester[0]
        });

    } catch (error) {
        console.error('Error creating semester:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to create semester",
            details: error.message
        }, { status: 500 });
    }
}
// is function se access karenge


export async function GET() {
    try {
        // sabhi semsmester ko fetch karlo 
        const semesters = await db.select().from(semestersTable);

        // Group by category
        const semestersByCategory = semesters.reduce((acc, semester) => {
            if (!acc[semester.category]) {
                acc[semester.category] = [];
            }
            acc[semester.category].push(semester);
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            semesters: semestersByCategory,
            total: semesters.length
        });

    } catch (error) {
        console.error('Error fetching semesters:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch semesters",
            details: error.message
        }, { status: 500 });
    }
}