import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { notificationsTable, usersTable } from '@/config/schema';
import { eq, and, desc } from 'drizzle-orm';

// Add runtime config for edge compatibility (optional)
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Retry helper for database operations
 */
async function retryDbOperation(operation, maxRetries = 2) {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (i < maxRetries) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                console.log(`Retrying database operation (attempt ${i + 2}/${maxRetries + 1})...`);
            }
        }
    }
    throw lastError;
}

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

        // Get user from database with retry logic
        const [user] = await retryDbOperation(async () => {
            return await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.userId, clerkUserId));
        });

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

        // Fetch notifications and unread count in parallel with retry logic
        const [notifications, unreadNotifications] = await Promise.all([
            retryDbOperation(async () => {
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

                return await query;
            }),
            retryDbOperation(async () => {
                return await db
                    .select()
                    .from(notificationsTable)
                    .where(
                        and(
                            eq(notificationsTable.userId, user.id),
                            eq(notificationsTable.isRead, false)
                        )
                    );
            })
        ]);

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount: unreadNotifications.length,
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);

        // Provide more detailed error information
        const errorMessage = error?.message || 'Failed to fetch notifications';
        const errorCode = error?.code || 'UNKNOWN_ERROR';

        console.error('Error details:', {
            message: errorMessage,
            code: errorCode,
            cause: error?.cause,
            stack: error?.stack,
        });

        return NextResponse.json(
            {
                error: 'Failed to fetch notifications',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
            },
            { status: 500 }
        );
    }
}
