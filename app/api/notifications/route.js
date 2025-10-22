import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { notificationsTable, usersTable } from '@/config/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * GET /api/notifications
 * Fetch notifications for current user
 */
export async function GET(request) {
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

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        // Build query
        let query = db
            .select()
            .from(notificationsTable)
            .where(eq(notificationsTable.userId, user.id))
            .orderBy(desc(notificationsTable.createdAt))
            .limit(limit);

        if (unreadOnly) {
            query = db
                .select()
                .from(notificationsTable)
                .where(
                    and(
                        eq(notificationsTable.userId, user.id),
                        eq(notificationsTable.isRead, false)
                    )
                )
                .orderBy(desc(notificationsTable.createdAt))
                .limit(limit);
        }

        const notifications = await query;

        // Count unread notifications
        const unreadCount = await db
            .select()
            .from(notificationsTable)
            .where(
                and(
                    eq(notificationsTable.userId, user.id),
                    eq(notificationsTable.isRead, false)
                )
            );

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount: unreadCount.length,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}
