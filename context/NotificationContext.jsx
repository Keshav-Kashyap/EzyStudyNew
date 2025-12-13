"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useFirebaseMessaging } from '@/hooks/useFirebaseMessaging';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user, isLoaded } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [browserPermission, setBrowserPermission] = useState('default');

    // Initialize Firebase messaging
    const {
        fcmToken,
        notificationPermission,
        isSupported: isFirebaseSupported,
        requestPermission: requestFirebasePermission,
        disableNotifications: disableFirebaseNotifications,
        setupForegroundListener,
    } = useFirebaseMessaging();

    // Fetch notifications
    const fetchNotifications = useCallback(async (unreadOnly = false) => {
        if (!isLoaded || !user) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/notifications', {
                params: { unreadOnly, limit: 50 }
            });

            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, [isLoaded, user]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            const response = await axios.patch(`/api/notifications/${notificationId}`);

            if (response.data.success) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId
                            ? { ...notif, isRead: true }
                            : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await axios.post('/api/notifications/mark-all-read');

            if (response.data.success) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
                setUnreadCount(0);
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    }, []);

    // Delete notification
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const response = await axios.delete(`/api/notifications/${notificationId}`);

            if (response.data.success) {
                const deletedNotif = notifications.find(n => n.id === notificationId);
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));

                if (deletedNotif && !deletedNotif.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    }, [notifications]);

    // Request browser notification permission
    const requestBrowserPermission = useCallback(async () => {
        if (!isFirebaseSupported) {
            console.log('⚠️ Push notifications not supported in this browser');
            return false;
        }

        // Request Firebase push notification permission
        const result = await requestFirebasePermission();
        
        if (result.success) {
            setBrowserPermission('granted');
            return true;
        } else {
            setBrowserPermission(notificationPermission);
            return false;
        }
    }, [isFirebaseSupported, requestFirebasePermission, notificationPermission]);

    // Show browser notification
    const showBrowserNotification = useCallback((title, options) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/icon.png',
                badge: '/badge.png',
                ...options,
            });

            notification.onclick = (event) => {
                event.preventDefault();
                if (options.data?.url) {
                    window.location.href = options.data.url;
                }
                notification.close();
            };

            return notification;
        }
        return null;
    }, []);

    // Add new notification (for real-time updates)
    const addNotification = useCallback((notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permission granted
        if (browserPermission === 'granted') {
            showBrowserNotification(notification.title, {
                body: notification.message,
                data: { url: notification.actionUrl },
            });
        }
    }, [browserPermission, showBrowserNotification]);

    // Initial fetch
    useEffect(() => {
        if (isLoaded && user) {
            fetchNotifications();
        }
    }, [isLoaded, user, fetchNotifications]);

    // Setup Firebase foreground message listener
    useEffect(() => {
        if (!isLoaded || !user || !fcmToken) return;

        const unsubscribe = setupForegroundListener((notificationData) => {
            console.log('📨 Received foreground notification:', notificationData);
            
            // Refresh notifications to get the new one
            fetchNotifications();
            
            // Show browser notification if tab is not active
            if (document.hidden && Notification.permission === 'granted') {
                const notification = new Notification(notificationData.title, {
                    body: notificationData.body,
                    icon: '/icon.png',
                    badge: '/badge.png',
                    data: notificationData.data,
                });
                
                notification.onclick = () => {
                    if (notificationData.data?.actionUrl) {
                        window.location.href = notificationData.data.actionUrl;
                    }
                    notification.close();
                };
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isLoaded, user, fcmToken, setupForegroundListener, fetchNotifications]);

    // Check browser notification permission on mount
    useEffect(() => {
        if (isFirebaseSupported) {
            setBrowserPermission(notificationPermission);
        }
    }, [isFirebaseSupported, notificationPermission]);

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!isLoaded || !user) return;

        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [isLoaded, user, fetchNotifications]);

    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        browserPermission,
        fcmToken,
        isFirebaseSupported,
        notificationPermission,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        requestBrowserPermission,
        showBrowserNotification,
        disableNotifications: disableFirebaseNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
