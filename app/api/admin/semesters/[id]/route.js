import { db } from '@/config/db';
import { adminSemesters } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { name, semesterNumber, description } = body;

        // Validate required fields
        if (!name?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Semester name is required' },
                { status: 400 }
            );
        }

        // Check if semester exists
        const existing = await db.select()
            .from(adminSemesters)
            .where(eq(adminSemesters.id, parseInt(id)))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Semester not found' },
                { status: 404 }
            );
        }

        // Check for duplicate semester number in same course
        const duplicate = await db.select()
            .from(adminSemesters)
            .where(eq(adminSemesters.semesterNumber, semesterNumber))
            .limit(1);

        if (duplicate.length > 0 && duplicate[0].id !== parseInt(id) && duplicate[0].courseId === existing[0].courseId) {
            return NextResponse.json(
                { success: false, error: 'A semester with this number already exists in this course' },
                { status: 400 }
            );
        }

        // Update semester
        const updated = await db.update(adminSemesters)
            .set({
                name: name.trim(),
                semesterNumber: semesterNumber || 1,
                description: description?.trim() || null,
                updatedAt: new Date()
            })
            .where(eq(adminSemesters.id, parseInt(id)))
            .returning();

        return NextResponse.json({
            success: true,
            data: updated[0],
            message: 'Semester updated successfully'
        });

    } catch (error) {
        console.error('Error updating semester:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update semester' },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        // Check if semester exists
        const existing = await db.select()
            .from(adminSemesters)
            .where(eq(adminSemesters.id, parseInt(id)))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Semester not found' },
                { status: 404 }
            );
        }

        // Delete semester (cascade will handle related subjects and materials)
        await db.delete(adminSemesters)
            .where(eq(adminSemesters.id, parseInt(id)));

        return NextResponse.json({
            success: true,
            message: 'Semester deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting semester:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete semester' },
            { status: 500 }
        );
    }
}
