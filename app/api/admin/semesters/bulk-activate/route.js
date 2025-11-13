import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { semestersTable } from '@/config/schema';
import { inArray } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/admin/semesters/bulk-activate
 * Activate multiple semesters at once
 */
export async function POST(request) {
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

        // Update all selected semesters
        const updated = await db
            .update(semestersTable)
            .set({
                isActive: true,
                updatedAt: new Date()
            })
            .where(inArray(semestersTable.id, semesterIds))
            .returning();

        return NextResponse.json({
            success: true,
            message: `${updated.length} semester(s) activated successfully`,
            count: updated.length
        });

    } catch (error) {
        console.error('Error activating semesters:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to activate semesters' },
            { status: 500 }
        );
    }
}
