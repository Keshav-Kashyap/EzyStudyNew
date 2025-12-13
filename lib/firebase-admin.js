/**
 * Firebase Admin SDK for Server-Side Push Notifications
 * This file handles sending push notifications to users via Firebase Cloud Messaging (FCM)
 */

let admin;
let messaging;

/**
 * Initialize Firebase Admin SDK
 * @returns {object} Firebase Admin instance
 */
function initializeFirebaseAdmin() {
    if (admin) {
        return admin;
    }

    try {
        // Import Firebase Admin SDK dynamically
        const adminSDK = require('firebase-admin');

        // Check if already initialized
        if (adminSDK.apps.length > 0) {
            admin = adminSDK;
            messaging = adminSDK.messaging();
            return admin;
        }

        // Initialize with service account credentials
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            : null;

        if (!serviceAccount) {
            console.error('❌ Firebase service account key not found in environment variables');
            return null;
        }

        admin = adminSDK.initializeApp({
            credential: adminSDK.credential.cert(serviceAccount),
        });

        messaging = admin.messaging();
        console.log('✅ Firebase Admin SDK initialized successfully');

        return admin;
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin SDK:', error);
        return null;
    }
}

/**
 * Send push notification to a single device
 * @param {string} fcmToken - Device FCM token
 * @param {object} notification - Notification payload
 * @returns {Promise<string|null>} Message ID or null if failed
 */
export async function sendPushNotificationToDevice(fcmToken, notification) {
    try {
        if (!fcmToken) {
            console.log('⚠️ No FCM token provided');
            return null;
        }

        initializeFirebaseAdmin();

        if (!messaging) {
            console.error('❌ Firebase messaging not initialized');
            return null;
        }

        const { title, body, data = {}, imageUrl } = notification;

        const message = {
            token: fcmToken,
            notification: {
                title,
                body,
                ...(imageUrl && { imageUrl }),
            },
            data: {
                ...data,
                clickAction: data.actionUrl || '/',
            },
            webpush: {
                fcmOptions: {
                    link: data.actionUrl || '/',
                },
            },
        };

        const response = await messaging.send(message);
        console.log('✅ Push notification sent successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ Error sending push notification:', error);

        // Handle invalid token errors
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
            console.log('⚠️ Invalid or expired FCM token, should be removed from database');
            return 'INVALID_TOKEN';
        }

        return null;
    }
}

/**
 * Send push notification to multiple devices
 * @param {Array<string>} fcmTokens - Array of device FCM tokens
 * @param {object} notification - Notification payload
 * @returns {Promise<object>} Result with success and failure counts
 */
export async function sendPushNotificationToMultipleDevices(fcmTokens, notification) {
    try {
        if (!fcmTokens || fcmTokens.length === 0) {
            console.log('⚠️ No FCM tokens provided');
            return { successCount: 0, failureCount: 0 };
        }

        initializeFirebaseAdmin();

        if (!messaging) {
            console.error('❌ Firebase messaging not initialized');
            return { successCount: 0, failureCount: 0 };
        }

        const { title, body, data = {}, imageUrl } = notification;

        // Filter out null/undefined tokens
        const validTokens = fcmTokens.filter(token => token);

        if (validTokens.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }

        const message = {
            notification: {
                title,
                body,
                ...(imageUrl && { imageUrl }),
            },
            data: {
                ...data,
                clickAction: data.actionUrl || '/',
            },
            webpush: {
                fcmOptions: {
                    link: data.actionUrl || '/',
                },
            },
            tokens: validTokens,
        };

        const response = await messaging.sendEachForMulticast(message);

        console.log(`✅ Push notifications sent: ${response.successCount} succeeded, ${response.failureCount} failed`);

        // Return invalid tokens for cleanup
        const invalidTokens = [];
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                const error = resp.error;
                if (error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered') {
                    invalidTokens.push(validTokens[idx]);
                }
            }
        });

        return {
            successCount: response.successCount,
            failureCount: response.failureCount,
            invalidTokens,
        };
    } catch (error) {
        console.error('❌ Error sending multicast push notifications:', error);
        return { successCount: 0, failureCount: fcmTokens.length };
    }
}

/**
 * Send push notification to all users (admin + students)
 * @param {Array<object>} users - Array of user objects with fcmToken
 * @param {object} notification - Notification payload
 * @returns {Promise<object>} Result with success and failure counts
 */
export async function sendPushNotificationToAllUsers(users, notification) {
    const fcmTokens = users
        .filter(user => user.fcmToken)
        .map(user => user.fcmToken);

    return await sendPushNotificationToMultipleDevices(fcmTokens, notification);
}

/**
 * Send push notification to all admins
 * @param {Array<object>} admins - Array of admin user objects with fcmToken
 * @param {object} notification - Notification payload
 * @returns {Promise<object>} Result with success and failure counts
 */
export async function sendPushNotificationToAdmins(admins, notification) {
    const adminTokens = admins
        .filter(admin => admin.fcmToken && admin.role === 'admin')
        .map(admin => admin.fcmToken);

    return await sendPushNotificationToMultipleDevices(adminTokens, notification);
}

/**
 * Send topic-based push notification
 * @param {string} topic - Topic name (e.g., 'all-users', 'admins')
 * @param {object} notification - Notification payload
 * @returns {Promise<string|null>} Message ID or null if failed
 */
export async function sendPushNotificationToTopic(topic, notification) {
    try {
        initializeFirebaseAdmin();

        if (!messaging) {
            console.error('❌ Firebase messaging not initialized');
            return null;
        }

        const { title, body, data = {}, imageUrl } = notification;

        const message = {
            topic,
            notification: {
                title,
                body,
                ...(imageUrl && { imageUrl }),
            },
            data: {
                ...data,
                clickAction: data.actionUrl || '/',
            },
            webpush: {
                fcmOptions: {
                    link: data.actionUrl || '/',
                },
            },
        };

        const response = await messaging.send(message);
        console.log(`✅ Push notification sent to topic "${topic}":`, response);
        return response;
    } catch (error) {
        console.error(`❌ Error sending push notification to topic "${topic}":`, error);
        return null;
    }
}

/**
 * Subscribe tokens to a topic
 * @param {Array<string>} tokens - Array of FCM tokens
 * @param {string} topic - Topic name
 * @returns {Promise<object>} Result with success and failure counts
 */
export async function subscribeToTopic(tokens, topic) {
    try {
        initializeFirebaseAdmin();

        if (!messaging) {
            console.error('❌ Firebase messaging not initialized');
            return { successCount: 0, failureCount: 0 };
        }

        const response = await messaging.subscribeToTopic(tokens, topic);
        console.log(`✅ Subscribed ${response.successCount} devices to topic "${topic}"`);
        return response;
    } catch (error) {
        console.error(`❌ Error subscribing to topic "${topic}":`, error);
        return { successCount: 0, failureCount: tokens.length };
    }
}

/**
 * Unsubscribe tokens from a topic
 * @param {Array<string>} tokens - Array of FCM tokens
 * @param {string} topic - Topic name
 * @returns {Promise<object>} Result with success and failure counts
 */
export async function unsubscribeFromTopic(tokens, topic) {
    try {
        initializeFirebaseAdmin();

        if (!messaging) {
            console.error('❌ Firebase messaging not initialized');
            return { successCount: 0, failureCount: 0 };
        }

        const response = await messaging.unsubscribeFromTopic(tokens, topic);
        console.log(`✅ Unsubscribed ${response.successCount} devices from topic "${topic}"`);
        return response;
    } catch (error) {
        console.error(`❌ Error unsubscribing from topic "${topic}":`, error);
        return { successCount: 0, failureCount: tokens.length };
    }
}
