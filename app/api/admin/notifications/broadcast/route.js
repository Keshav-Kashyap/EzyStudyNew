import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkAdminAccess } from '@/lib/admin-auth';
import { createNotificationForAllUsers, generateNotificationMessage, NOTIFICATION_TYPES } from '@/services/notificationService';

/**
 * POST /api/admin/notifications/broadcast
 * Broadcast notification to all users (Admin only)
 * Use this in your admin actions when creating/updating content
 */
export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const adminCheck = await checkAdminAccess();
        if (!adminCheck.isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            type,
            courseName,
            courseCode,
            semesterName,
            subjectName,
            materialTitle,
            actionUrl
        } = body;

        // Validate notification type
        if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
            return NextResponse.json(
                { error: 'Invalid notification type' },
                { status: 400 }
            );
        }

        // Generate notification message
        const { title, message } = generateNotificationMessage(type, {
            courseName,
            semesterName,
            subjectName,
            materialTitle
        });

        // Create notifications for all users
        const result = await createNotificationForAllUsers({
            type,
            title,
            message,
            courseCode,
            courseName,
            semesterName,
            subjectName,
            materialTitle,
            actionUrl
        });

        return NextResponse.json({
            success: true,
            message: 'Notification broadcasted successfully',
            recipientCount: result.recipientCount,
            notification: {
                type,
                title,
                message,
                timestamp: result.timestamp
            }
        });
    } catch (error) {
        console.error('Error broadcasting notification:', error);
        return NextResponse.json(
            { error: 'Failed to broadcast notification' },
            { status: 500 }
        );
    }
}
