import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { semestersTable, subjectsTable, studyMaterialsTable } from '@/config/schema';
import { inArray, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * DELETE /api/admin/semesters/bulk-delete
 * Delete multiple semesters and their related data at once
 */
export async function DELETE(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { semesterIds } = body;

        if (!semesterIds || !Array.isArray(semesterIds) || semesterIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Semester IDs array is required' },
                { status: 400 }
            );
        }

        // Get semester names for the deletion
        const semestersToDelete = await db
            .select()
            .from(semestersTable)
            .where(inArray(semestersTable.id, semesterIds));

        if (semestersToDelete.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No semesters found' },
                { status: 404 }
            );
        }

        const semesterNames = semestersToDelete.map(s => s.name);

        // Get all subjects in these semesters
        const subjects = await db
            .select()
            .from(subjectsTable)
            .where(inArray(subjectsTable.semesterName, semesterNames));

        const subjectIds = subjects.map(s => s.id);

        // Delete study materials first (if any subjects exist)
        if (subjectIds.length > 0) {
            await db
                .delete(studyMaterialsTable)
                .where(inArray(studyMaterialsTable.subjectId, subjectIds));
        }

        // Delete subjects
        if (semesterNames.length > 0) {
            await db
                .delete(subjectsTable)
                .where(inArray(subjectsTable.semesterName, semesterNames));
        }

        // Delete semesters
        const deleted = await db
            .delete(semestersTable)
            .where(inArray(semestersTable.id, semesterIds))
            .returning();

        return NextResponse.json({
            success: true,
            message: `${deleted.length} semester(s) and their related data deleted successfully`,
            count: deleted.length
        });

    } catch (error) {
        console.error('Error deleting semesters:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete semesters' },
            { status: 500 }
        );
    }
}
