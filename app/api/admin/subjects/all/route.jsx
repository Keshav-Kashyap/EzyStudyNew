import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/admin-auth";
import { db } from "@/config/db";
import { subjectsTable, coursesTable, semestersTable } from '@/config/schema';
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const adminCheck = await checkAdminAccess();

        if (!adminCheck.isAuthenticated) {
            return NextResponse.json({
                success: false,
                error: "Please login first"
            }, { status: 401 });
        }

        if (!adminCheck.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Admin access required"
            }, { status: 403 });
        }

        // Get all subjects with course and semester info
        const subjects = await db
            .select({
                id: subjectsTable.id,
                name: subjectsTable.name,
                code: subjectsTable.code,
                category: subjectsTable.category,
                semesterName: subjectsTable.semesterName,
                credits: subjectsTable.credits,
            })
            .from(subjectsTable)
            .orderBy(subjectsTable.category, subjectsTable.semesterName, subjectsTable.name);

        // Group subjects by course and semester for easy selection
        const groupedSubjects = subjects.reduce((acc, subject) => {
            const key = `${subject.category} - ${subject.semesterName}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                id: subject.id,
                name: subject.name,
                code: subject.code,
                label: `${subject.name} (${subject.code})`
            });
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            subjects: subjects,
            grouped: groupedSubjects,
            count: subjects.length
        });

    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch subjects",
            details: error.message
        }, { status: 500 });
    }
}
