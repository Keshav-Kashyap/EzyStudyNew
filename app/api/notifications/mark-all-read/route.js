import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { notificationsTable, usersTable } from '@/config/schema';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for current user
 */
export async function POST(request) {
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

        // Mark all as read
        await db
            .update(notificationsTable)
            .set({ isRead: true })
            .where(
                and(
                    eq(notificationsTable.userId, user.id),
                    eq(notificationsTable.isRead, false)
                )
            );

        return NextResponse.json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark notifications as read' },
            { status: 500 }
        );
    }
}
