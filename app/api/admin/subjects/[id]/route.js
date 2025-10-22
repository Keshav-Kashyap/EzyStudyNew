import { db } from '@/config/db';
import { adminSubjects } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { name, code, description, credits } = body;

        // Validate required fields
        if (!name?.trim() || !code?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Subject name and code are required' },
                { status: 400 }
            );
        }

        // Check if subject exists
        const existing = await db.select()
            .from(adminSubjects)
            .where(eq(adminSubjects.id, parseInt(id)))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Subject not found' },
                { status: 404 }
            );
        }

        // Check for duplicate subject code in same semester
        const duplicate = await db.select()
            .from(adminSubjects)
            .where(eq(adminSubjects.code, code.trim().toUpperCase()))
            .limit(1);

        if (duplicate.length > 0 && duplicate[0].id !== parseInt(id) && duplicate[0].semesterId === existing[0].semesterId) {
            return NextResponse.json(
                { success: false, error: 'A subject with this code already exists in this semester' },
                { status: 400 }
            );
        }

        // Update subject
        const updated = await db.update(adminSubjects)
            .set({
                name: name.trim(),
                code: code.trim().toUpperCase(),
                description: description?.trim() || null,
                credits: credits || 4,
                updatedAt: new Date()
            })
            .where(eq(adminSubjects.id, parseInt(id)))
            .returning();

        return NextResponse.json({
            success: true,
            data: updated[0],
            message: 'Subject updated successfully'
        });

    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update subject' },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        // Check if subject exists
        const existing = await db.select()
            .from(adminSubjects)
            .where(eq(adminSubjects.id, parseInt(id)))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Subject not found' },
                { status: 404 }
            );
        }

        // Delete subject (cascade will handle related materials)
        await db.delete(adminSubjects)
            .where(eq(adminSubjects.id, parseInt(id)));

        return NextResponse.json({
            success: true,
            message: 'Subject deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete subject' },
            { status: 500 }
        );
    }
}
