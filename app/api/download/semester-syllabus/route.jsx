import { db } from "@/config/db";
import { subjectsTable, semestersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { semesterId } = await req.json();

        if (!semesterId) {
            return NextResponse.json(
                { success: false, error: 'Semester ID is required' },
                { status: 400 }
            );
        }

        // Fetch all subjects with syllabus for this semester
        const subjects = await db
            .select({
                id: subjectsTable.id,
                name: subjectsTable.name,
                code: subjectsTable.code,
                syllabusUrl: subjectsTable.syllabusUrl
            })
            .from(subjectsTable)
            .where(eq(subjectsTable.semesterId, semesterId));

        if (!subjects || subjects.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No subjects found for this semester' },
                { status: 404 }
            );
        }

        // Filter subjects that have syllabusUrl
        const syllabi = subjects
            .filter(subject => subject.syllabusUrl)
            .map(subject => ({
                subjectId: subject.id,
                subjectName: subject.name,
                subjectCode: subject.code,
                syllabusUrl: subject.syllabusUrl
            }));

        if (syllabi.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No syllabus available for any subject in this semester' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            syllabi,
            totalSubjects: subjects.length,
            syllabusCount: syllabi.length
        });

    } catch (error) {
        console.error('Error fetching semester syllabus:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch syllabus' },
            { status: 500 }
        );
    }
}
