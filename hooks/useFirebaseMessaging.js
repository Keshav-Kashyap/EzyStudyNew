/**
 * Firebase Messaging Hook
 * Custom React hook to handle Firebase push notifications
 */

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    requestNotificationPermission,
    getFCMToken,
    onForegroundMessage,
    saveFCMTokenToBackend,
    removeFCMTokenFromBackend,
    isNotificationSupported,
    getNotificationPermission,
} from '@/lib/firebase-client';

export function useFirebaseMessaging() {
    const { user, isLoaded } = useUser();
    const [fcmToken, setFcmToken] = useState(null);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Check if notifications are supported
    useEffect(() => {
        const supported = isNotificationSupported();
        setIsSupported(supported);
        
        if (supported) {
            setNotificationPermission(getNotificationPermission());
        }
    }, []);

    // Initialize Firebase messaging when user is loaded
    useEffect(() => {
        if (!isLoaded || !user || !isSupported || isInitializing) {
            return;
        }

        initializeMessaging();
    }, [isLoaded, user, isSupported]);

    /**
     * Initialize Firebase messaging
     */
    const initializeMessaging = async () => {
        try {
            setIsInitializing(true);
            setError(null);

            // Check if already have token in session
            const savedToken = sessionStorage.getItem('fcm_token');
            if (savedToken) {
                setFcmToken(savedToken);
                setIsInitializing(false);
                return;
            }

            // If permission already granted, get token
            if (Notification.permission === 'granted') {
                const token = await getFCMToken();
                if (token) {
                    setFcmToken(token);
                    sessionStorage.setItem('fcm_token', token);
                    await saveFCMTokenToBackend(token);
                }
            }
        } catch (err) {
            console.error('Error initializing Firebase messaging:', err);
            setError(err.message);
        } finally {
            setIsInitializing(false);
        }
    };

    /**
     * Request notification permission from user
     */
    const requestPermission = useCallback(async () => {
        try {
            setError(null);
            const token = await requestNotificationPermission();
            
            if (token) {
                setFcmToken(token);
                sessionStorage.setItem('fcm_token', token);
                setNotificationPermission('granted');
                
                // Save to backend
                await saveFCMTokenToBackend(token);
                
                return { success: true, token };
            } else {
                setNotificationPermission(Notification.permission);
                return { success: false, error: 'Permission denied' };
            }
        } catch (err) {
            console.error('Error requesting notification permission:', err);
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    /**
     * Disable notifications
     */
    const disableNotifications = useCallback(async () => {
        try {
            await removeFCMTokenFromBackend();
            setFcmToken(null);
            sessionStorage.removeItem('fcm_token');
            return { success: true };
        } catch (err) {
            console.error('Error disabling notifications:', err);
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    /**
     * Listen for foreground messages
     */
    const setupForegroundListener = useCallback((callback) => {
        if (!isSupported) {
            return () => {};
        }

        return onForegroundMessage(callback);
    }, [isSupported]);

    return {
        fcmToken,
        notificationPermission,
        isSupported,
        isInitializing,
        error,
        requestPermission,
        disableNotifications,
        setupForegroundListener,
    };
}
