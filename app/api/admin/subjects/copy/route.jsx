import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/admin-auth";
import { db } from "@/config/db";
import { subjectsTable, coursesTable, semestersTable } from '@/config/schema';
import { eq, and } from "drizzle-orm";

export async function POST(request) {
    try {
        const adminCheck = await checkAdminAccess();

        if (!adminCheck.isAuthenticated || !adminCheck.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Admin access required"
            }, { status: 403 });
        }

        const { subjectId, targetCourse, targetSemester } = await request.json();

        if (!subjectId || !targetCourse || !targetSemester) {
            return NextResponse.json({
                success: false,
                error: "Subject ID, target course, and semester are required"
            }, { status: 400 });
        }

        // Get original subject details
        const [originalSubject] = await db
            .select()
            .from(subjectsTable)
            .where(eq(subjectsTable.id, subjectId));

        if (!originalSubject) {
            return NextResponse.json({
                success: false,
                error: "Subject not found"
            }, { status: 404 });
        }

        // Check if subject already exists in target location
        const existingSubject = await db
            .select()
            .from(subjectsTable)
            .where(
                and(
                    eq(subjectsTable.code, originalSubject.code),
                    eq(subjectsTable.category, targetCourse),
                    eq(subjectsTable.semesterName, targetSemester)
                )
            );

        if (existingSubject.length > 0) {
            return NextResponse.json({
                success: false,
                error: `Subject "${originalSubject.name}" already exists in ${targetCourse} - ${targetSemester}`
            }, { status: 409 });
        }

        // Create new subject entry in target course/semester
        const [newSubject] = await db.insert(subjectsTable).values({
            name: originalSubject.name,
            code: originalSubject.code,
            category: targetCourse,
            semesterName: targetSemester,
            credits: originalSubject.credits,
            description: originalSubject.description,
            isActive: originalSubject.isActive,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();

        // Copy all material mappings from original subject to new subject
        const originalMappings = await db
            .select()
            .from(subjectsTable)
            .where(eq(subjectsTable.id, subjectId));

        // Get material IDs associated with original subject
        const { materialSubjectMappingTable } = await import('@/config/schema');
        const materialMappings = await db
            .select()
            .from(materialSubjectMappingTable)
            .where(eq(materialSubjectMappingTable.subjectId, subjectId));

        // Create mappings for new subject
        if (materialMappings.length > 0) {
            const newMappings = materialMappings.map(mapping => ({
                materialId: mapping.materialId,
                subjectId: newSubject.id,
                createdAt: new Date()
            }));

            await db.insert(materialSubjectMappingTable).values(newMappings);
        }

        return NextResponse.json({
            success: true,
            message: `Subject "${originalSubject.name}" added to ${targetCourse} - ${targetSemester}`,
            data: {
                newSubject,
                materialsCopied: materialMappings.length,
                originalSubject: {
                    id: originalSubject.id,
                    name: originalSubject.name,
                    code: originalSubject.code,
                    course: originalSubject.category,
                    semester: originalSubject.semesterName
                }
            }
        });

    } catch (error) {
        console.error('Error copying subject:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to copy subject",
            details: error.message
        }, { status: 500 });
    }
}
