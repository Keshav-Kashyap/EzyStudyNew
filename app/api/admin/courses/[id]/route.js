import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { createNotificationForAllUsers, NOTIFICATION_TYPES } from '@/services/notificationService';

// PUT - Update course
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { name, code, description, duration } = body;

        // Validation
        if (!name || !code) {
            return NextResponse.json(
                { success: false, error: 'Name and code are required' },
                { status: 400 }
            );
        }

        // Check if course exists
        const existingCourse = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.id, parseInt(id)))
            .limit(1);

        if (existingCourse.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Course not found' },
                { status: 404 }
            );
        }

        // Check if category is being changed and if new category already exists
        if (code.toUpperCase() !== existingCourse[0].category) {
            const categoryExists = await db
                .select()
                .from(coursesTable)
                .where(eq(coursesTable.category, code.toUpperCase()))
                .limit(1);

            if (categoryExists.length > 0) {
                return NextResponse.json(
                    { success: false, error: 'Course category already exists' },
                    { status: 409 }
                );
            }
        }

        // Update course
        const [updatedCourse] = await db
            .update(coursesTable)
            .set({
                title: name.trim(),
                category: code.toUpperCase().trim(),
                description: description?.trim() || null,
                updatedAt: new Date()
            })
            .where(eq(coursesTable.id, parseInt(id)))
            .returning();

        // Send notification to all users about course update
        try {
            await createNotificationForAllUsers({
                type: NOTIFICATION_TYPES.COURSE_UPDATED,
                title: '🔄 Course Updated!',
                message: `The course "${updatedCourse.title}" has been updated with new information.`,
                courseName: updatedCourse.title,
                courseCode: updatedCourse.category,
                actionUrl: `/library?course=${updatedCourse.category}`,
            });
            console.log('✅ Notification sent about course update');
        } catch (notifError) {
            console.error('⚠️ Failed to send course update notification:', notifError);
        }

        return NextResponse.json({
            success: true,
            course: updatedCourse
        });
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update course' },
            { status: 500 }
        );
    }
}

// DELETE - Delete course
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Check if course exists
        const existingCourse = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.id, parseInt(id)))
            .limit(1);

        if (existingCourse.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Course not found' },
                { status: 404 }
            );
        }

        // Delete course
        await db
            .delete(coursesTable)
            .where(eq(coursesTable.id, parseInt(id)));

        return NextResponse.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete course' },
            { status: 500 }
        );
    }
}
