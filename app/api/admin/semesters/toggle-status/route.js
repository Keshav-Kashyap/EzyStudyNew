import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { semestersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/admin/semesters/toggle-status
 * Toggle semester active/inactive status
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
        const { semesterId, isActive } = body;

        if (!semesterId) {
            return NextResponse.json(
                { success: false, error: 'Semester ID is required' },
                { status: 400 }
            );
        }

        // Update semester status
        const updated = await db
            .update(semestersTable)
            .set({
                isActive: isActive,
                updatedAt: new Date()
            })
            .where(eq(semestersTable.id, semesterId))
            .returning();

        if (updated.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Semester not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Semester ${isActive ? 'activated' : 'deactivated'} successfully`,
            semester: updated[0]
        });

    } catch (error) {
        console.error('Error toggling semester status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update semester status' },
            { status: 500 }
        );
    }
}
