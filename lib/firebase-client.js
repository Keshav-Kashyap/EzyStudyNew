/**
 * Firebase Client Configuration for Browser Push Notifications
 * This file initializes Firebase for client-side push notification handling
 */

import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp;
let messaging;

/**
 * Initialize Firebase app (only in browser)
 */
export function initializeFirebase() {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApps()[0];
    }

    return firebaseApp;
}

/**
 * Get Firebase Messaging instance (only in browser)
 */
export function getFirebaseMessaging() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    try {
        if (!messaging) {
            const app = initializeFirebase();
            if (app) {
                messaging = getMessaging(app);
            }
        }
        return messaging;
    } catch (error) {
        console.error('Error getting Firebase messaging:', error);
        return null;
    }
}

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null if failed
 */
export async function requestNotificationPermission() {
    try {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.log('⚠️ Browser does not support notifications');
            return null;
        }

        // Check if permission is already granted
        if (Notification.permission === 'granted') {
            return await getFCMToken();
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('✅ Notification permission granted');
            return await getFCMToken();
        } else {
            console.log('⚠️ Notification permission denied');
            return null;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return null;
    }
}

/**
 * Get FCM registration token
 * @returns {Promise<string|null>} FCM token or null if failed
 */
export async function getFCMToken() {
    try {
        const messaging = getFirebaseMessaging();
        if (!messaging) {
            console.log('⚠️ Firebase messaging not available');
            return null;
        }

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error('❌ VAPID key not configured');
            return null;
        }

        // Register service worker first
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Service worker registered');

        // Get FCM token
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        if (token) {
            console.log('✅ FCM token obtained:', token.substring(0, 20) + '...');
            return token;
        } else {
            console.log('⚠️ No FCM token available');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        
        // Handle specific errors
        if (error.code === 'messaging/permission-blocked') {
            console.log('⚠️ Notification permission blocked by user');
        } else if (error.code === 'messaging/failed-service-worker-registration') {
            console.error('❌ Service worker registration failed');
        }
        
        return null;
    }
}

/**
 * Listen for foreground messages
 * @param {Function} callback - Callback function to handle incoming messages
 */
export function onForegroundMessage(callback) {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
        return () => {}; // Return empty unsubscribe function
    }

    return onMessage(messaging, (payload) => {
        console.log('📨 Foreground message received:', payload);
        
        // Extract notification data
        const notificationData = {
            title: payload.notification?.title || 'New Notification',
            body: payload.notification?.body || '',
            data: payload.data || {},
        };

        // Call the callback with notification data
        if (callback && typeof callback === 'function') {
            callback(notificationData);
        }

        // Show browser notification if not visible
        if (document.hidden && Notification.permission === 'granted') {
            new Notification(notificationData.title, {
                body: notificationData.body,
                icon: '/icon.png',
                badge: '/badge.png',
                tag: `notification-${Date.now()}`,
                data: notificationData.data,
            });
        }
    });
}

/**
 * Save FCM token to backend
 * @param {string} token - FCM token to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveFCMTokenToBackend(token) {
    try {
        const response = await fetch('/api/notifications/fcm-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fcmToken: token }),
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ FCM token saved to backend');
            return true;
        } else {
            console.error('❌ Failed to save FCM token:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error saving FCM token to backend:', error);
        return false;
    }
}

/**
 * Remove FCM token from backend
 * @returns {Promise<boolean>} Success status
 */
export async function removeFCMTokenFromBackend() {
    try {
        const response = await fetch('/api/notifications/fcm-token', {
            method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ FCM token removed from backend');
            return true;
        } else {
            console.error('❌ Failed to remove FCM token:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error removing FCM token from backend:', error);
        return false;
    }
}

/**
 * Check if browser supports notifications
 * @returns {boolean} True if supported
 */
export function isNotificationSupported() {
    return typeof window !== 'undefined' && 
           'Notification' in window && 
           'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 * @returns {string} Permission status ('granted', 'denied', 'default')
 */
export function getNotificationPermission() {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }
    return Notification.permission;
}
