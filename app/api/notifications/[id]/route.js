import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { notificationsTable, usersTable } from '@/config/schema';
import { eq, and } from 'drizzle-orm';

/**
 * PATCH /api/notifications/[id]
 * Mark notification as read
 */
export async function PATCH(request, { params }) {
    try {
        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user from database
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.userId, clerkUserId));

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { id } = await params;

        // Update notification
        const [updatedNotification] = await db
            .update(notificationsTable)
            .set({ isRead: true })
            .where(
                and(
                    eq(notificationsTable.id, parseInt(id)),
                    eq(notificationsTable.userId, user.id)
                )
            )
            .returning();

        if (!updatedNotification) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            notification: updatedNotification,
        });
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: 'Failed to update notification' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/notifications/[id]
 * Delete notification
 */
export async function DELETE(request, { params }) {
    try {
        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user from database
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.userId, clerkUserId));

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { id } = await params;

        // Delete notification
        const [deletedNotification] = await db
            .delete(notificationsTable)
            .where(
                and(
                    eq(notificationsTable.id, parseInt(id)),
                    eq(notificationsTable.userId, user.id)
                )
            )
            .returning();

        if (!deletedNotification) {
            return NextResponse.json(
                { error: 'Notification not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json(
            { error: 'Failed to delete notification' },
            { status: 500 }
        );
    }
}
