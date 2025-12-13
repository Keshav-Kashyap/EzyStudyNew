/**
 * Notification Service
 * Handles creating and broadcasting notifications to users
 */

import { db } from '@/config/db';
import { notificationsTable, usersTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { 
    sendPushNotificationToAllUsers, 
    sendPushNotificationToAdmins,
    sendPushNotificationToDevice,
    sendPushNotificationToMultipleDevices
} from '@/lib/firebase-admin';

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
    COURSE_CREATED: 'course_created',
    SEMESTER_CREATED: 'semester_created',
    SUBJECT_CREATED: 'subject_created',
    MATERIAL_UPLOADED: 'material_uploaded',
    COURSE_UPDATED: 'course_updated',
    SEMESTER_UPDATED: 'semester_updated',
    SUBJECT_UPDATED: 'subject_updated',
};

/**
 * Create notification for all users
 */
export async function createNotificationForAllUsers({
    type,
    title,
    message,
    courseCode,
    courseName,
    semesterName,
    subjectName,
    materialTitle,
    actionUrl
}) {
    try {
        // Get all active users with FCM tokens
        const users = await db
            .select({ 
                id: usersTable.id,
                fcmToken: usersTable.fcmToken,
                name: usersTable.name,
                email: usersTable.email
            })
            .from(usersTable)
            .where(eq(usersTable.isActive, true));

        // Create notification for each user
        const notifications = users.map(user => ({
            userId: user.id,
            type,
            title,
            message,
            courseCode: courseCode || null,
            courseName: courseName || null,
            semesterName: semesterName || null,
            subjectName: subjectName || null,
            materialTitle: materialTitle || null,
            actionUrl: actionUrl || null,
            isRead: false,
        }));

        // Bulk insert notifications
        if (notifications.length > 0) {
            await db.insert(notificationsTable).values(notifications);
        }

        // Send Firebase push notifications to all users
        const pushResult = await sendPushNotificationToAllUsers(users, {
            title,
            body: message,
            data: {
                type,
                actionUrl: actionUrl || '/',
                courseCode,
                courseName,
                semesterName,
                subjectName,
                materialTitle,
            }
        });

        console.log(`✅ Notifications sent: ${pushResult.successCount} push, ${users.length} in-app`);

        // Return for real-time broadcasting
        return {
            type,
            title,
            message,
            courseCode,
            courseName,
            semesterName,
            subjectName,
            materialTitle,
            actionUrl,
            timestamp: new Date(),
            recipientCount: users.length,
            pushSent: pushResult.successCount
        };
    } catch (error) {
        console.error('Error creating notifications:', error);
        throw error;
    }
}

/**
 * Create notification for specific user
 */
export async function createNotificationForUser({
    userId,
    type,
    title,
    message,
    courseCode,
    courseName,
    semesterName,
    subjectName,
    materialTitle,
    actionUrl
}) {
    try {
        // Get user with FCM token
        const [user] = await db
            .select({
                id: usersTable.id,
                fcmToken: usersTable.fcmToken,
                email: usersTable.email
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (!user) {
            throw new Error('User not found');
        }

        const [notification] = await db
            .insert(notificationsTable)
            .values({
                userId,
                type,
                title,
                message,
                courseCode: courseCode || null,
                courseName: courseName || null,
                semesterName: semesterName || null,
                subjectName: subjectName || null,
                materialTitle: materialTitle || null,
                actionUrl: actionUrl || null,
                isRead: false,
            })
            .returning();

        // Send Firebase push notification if token exists
        if (user.fcmToken) {
            await sendPushNotificationToDevice(user.fcmToken, {
                title,
                body: message,
                data: {
                    type,
                    actionUrl: actionUrl || '/',
                    courseCode,
                    courseName,
                    semesterName,
                    subjectName,
                    materialTitle,
                }
            });
        }

        return notification;
    } catch (error) {
        console.error('Error creating user notification:', error);
        throw error;
    }
}

/**
 * Create notification for all admins
 */
export async function createNotificationForAdmins({
    type,
    title,
    message,
    courseCode,
    courseName,
    semesterName,
    subjectName,
    materialTitle,
    actionUrl
}) {
    try {
        // Get all admin users with FCM tokens
        const admins = await db
            .select({
                id: usersTable.id,
                fcmToken: usersTable.fcmToken,
                name: usersTable.name,
                email: usersTable.email,
                role: usersTable.role
            })
            .from(usersTable)
            .where(eq(usersTable.role, 'admin'));

        if (admins.length === 0) {
            console.log('⚠️ No admins found to notify');
            return {
                type,
                title,
                message,
                recipientCount: 0,
                pushSent: 0
            };
        }

        // Create notification for each admin
        const notifications = admins.map(admin => ({
            userId: admin.id,
            type,
            title,
            message,
            courseCode: courseCode || null,
            courseName: courseName || null,
            semesterName: semesterName || null,
            subjectName: subjectName || null,
            materialTitle: materialTitle || null,
            actionUrl: actionUrl || null,
            isRead: false,
        }));

        // Bulk insert notifications
        await db.insert(notificationsTable).values(notifications);

        // Send Firebase push notifications to all admins
        const pushResult = await sendPushNotificationToAdmins(admins, {
            title,
            body: message,
            data: {
                type,
                actionUrl: actionUrl || '/',
                courseCode,
                courseName,
                semesterName,
                subjectName,
                materialTitle,
            }
        });

        console.log(`✅ Admin notifications sent: ${pushResult.successCount} push, ${admins.length} in-app`);

        return {
            type,
            title,
            message,
            courseCode,
            courseName,
            semesterName,
            subjectName,
            materialTitle,
            actionUrl,
            timestamp: new Date(),
            recipientCount: admins.length,
            pushSent: pushResult.successCount
        };
    } catch (error) {
        console.error('Error creating admin notifications:', error);
        throw error;
    }
}

/**
 * Helper function to generate notification message
 */
export function generateNotificationMessage(type, data) {
    const { courseName, semesterName, subjectName, materialTitle } = data;

    switch (type) {
        case NOTIFICATION_TYPES.COURSE_CREATED:
            return {
                title: '🎓 New Course Available!',
                message: `A new course "${courseName}" has been added to the platform. Check it out now!`,
            };

        case NOTIFICATION_TYPES.SEMESTER_CREATED:
            return {
                title: '📚 New Semester Added!',
                message: `${semesterName} has been added to ${courseName}. New study materials are now available!`,
            };

        case NOTIFICATION_TYPES.SUBJECT_CREATED:
            return {
                title: '📖 New Subject Added!',
                message: `${subjectName} has been added to ${semesterName} in ${courseName}.`,
            };

        case NOTIFICATION_TYPES.MATERIAL_UPLOADED:
            return {
                title: '📄 New Study Material Available!',
                message: `"${materialTitle}" has been uploaded for ${subjectName} in ${semesterName}.`,
            };

        case NOTIFICATION_TYPES.COURSE_UPDATED:
            return {
                title: '🔄 Course Updated!',
                message: `The course "${courseName}" has been updated with new information.`,
            };

        case NOTIFICATION_TYPES.SEMESTER_UPDATED:
            return {
                title: '🔄 Semester Updated!',
                message: `${semesterName} in ${courseName} has been updated.`,
            };

        case NOTIFICATION_TYPES.SUBJECT_UPDATED:
            return {
                title: '🔄 Subject Updated!',
                message: `${subjectName} has been updated with new information.`,
            };

        default:
            return {
                title: '🔔 New Notification',
                message: 'You have a new notification.',
            };
    }
}

/**
 * Send browser notification (client-side helper data)
 */
export function prepareBrowserNotification(type, data) {
    const { title, message } = generateNotificationMessage(type, data);

    return {
        title,
        body: message,
        icon: '/icon.png', // Add your app icon
        badge: '/badge.png', // Add your badge icon
        tag: `notification-${Date.now()}`,
        requireInteraction: false,
        data: {
            url: data.actionUrl || '/',
        }
    };
}
