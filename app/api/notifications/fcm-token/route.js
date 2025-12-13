import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/notifications/fcm-token
 * Save or update user's FCM token for push notifications
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

        const { fcmToken } = await request.json();

        if (!fcmToken) {
            return NextResponse.json(
                { error: 'FCM token is required' },
                { status: 400 }
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

        // Update user's FCM token
        await db
            .update(usersTable)
            .set({ 
                fcmToken,
                updatedAt: new Date()
            })
            .where(eq(usersTable.userId, clerkUserId));

        console.log(`✅ FCM token saved for user ${user.email}`);

        return NextResponse.json({
            success: true,
            message: 'FCM token saved successfully',
        });
    } catch (error) {
        console.error('Error saving FCM token:', error);
        return NextResponse.json(
            { error: 'Failed to save FCM token' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/notifications/fcm-token
 * Remove user's FCM token (on logout or notification disable)
 */
export async function DELETE(request) {
    try {
        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Remove FCM token from user
        await db
            .update(usersTable)
            .set({ 
                fcmToken: null,
                updatedAt: new Date()
            })
            .where(eq(usersTable.userId, clerkUserId));

        console.log(`✅ FCM token removed for user ${clerkUserId}`);

        return NextResponse.json({
            success: true,
            message: 'FCM token removed successfully',
        });
    } catch (error) {
        console.error('Error removing FCM token:', error);
        return NextResponse.json(
            { error: 'Failed to remove FCM token' },
            { status: 500 }
        );
    }
}
