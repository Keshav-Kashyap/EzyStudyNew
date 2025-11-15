import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/admin-auth";
import { db } from "@/config/db";
import { subjectsTable, coursesTable, semestersTable } from '@/config/schema';
import { eq, asc } from "drizzle-orm";

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
            })
            .from(subjectsTable)
            .orderBy(asc(subjectsTable.category));

        // Ensure subjects is an array and has valid data
        const subjectsArray = Array.isArray(subjects) ? subjects : [];
        
        console.log(`Fetched ${subjectsArray.length} subjects`);

        // Group subjects by course and semester for easy selection
        const groupedSubjects = {};
        
        subjectsArray.forEach(subject => {
            try {
                if (subject && subject.category && subject.semesterName) {
                    const key = `${subject.category} - ${subject.semesterName}`;
                    if (!groupedSubjects[key]) {
                        groupedSubjects[key] = [];
                    }
                    groupedSubjects[key].push({
                        id: subject.id,
                        name: subject.name,
                        code: subject.code,
                        category: subject.category,
                        semesterName: subject.semesterName,
                        label: `${subject.name} (${subject.code})`
                    });
                }
            } catch (err) {
                console.error('Error processing subject:', subject, err);
            }
        });

        return NextResponse.json({
            success: true,
            subjects: subjectsArray,
            grouped: groupedSubjects,
            count: subjectsArray.length
        });

    } catch (error) {
        console.error('Error fetching subjects:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch subjects",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
