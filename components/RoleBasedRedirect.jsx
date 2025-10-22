"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleBasedRedirect() {
    const { user, isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        async function checkUserRole() {
            if (!isLoaded || !isSignedIn || !user || checking || hasChecked) {
                return;
            }

            // Check if role was already checked in this session
            const sessionKey = `user_role_checked_${user.id}`;
            const roleData = sessionStorage.getItem(sessionKey);

            if (roleData) {
                const { isAdmin, checkedAt } = JSON.parse(roleData);
                const tenMinutesAgo = Date.now() - (10 * 60 * 1000);

                // Use cached data if less than 10 minutes old
                if (checkedAt > tenMinutesAgo) {
                    handleRedirect(isAdmin);
                    setHasChecked(true);
                    return;
                }
            }

            setChecking(true);

            try {
                // Check admin status (UserAutoRegister handles user registration)
                const response = await fetch('/api/admin/check-auth');
                const result = await response.json();

                if (result.success && result.isAuthenticated) {
                    const isAdmin = result.isAdmin;

                    // Cache the result
                    sessionStorage.setItem(sessionKey, JSON.stringify({
                        isAdmin,
                        checkedAt: Date.now()
                    }));

                    handleRedirect(isAdmin);
                } else if (result.error && result.error.includes('database connection')) {
                    // Database connection error - temporary admin access
                    console.warn('🚨 Database connection failed, using temporary admin access');

                    // Check if user email contains admin keywords as fallback
                    const userEmail = user.emailAddresses?.[0]?.emailAddress || '';
                    const isTemporaryAdmin = userEmail.includes('admin') ||
                        userEmail.includes('keshav') ||
                        userEmail.endsWith('@admin.com');

                    sessionStorage.setItem(sessionKey, JSON.stringify({
                        isAdmin: isTemporaryAdmin,
                        checkedAt: Date.now(),
                        temporary: true
                    }));

                    handleRedirect(isTemporaryAdmin);
                }
            } catch (error) {
                console.error(' Error checking user role:', error);

                // Network error - provide temporary admin access based on email
                const userEmail = user.emailAddresses?.[0]?.emailAddress || '';
                const isTemporaryAdmin = userEmail.includes('admin') ||
                    userEmail.includes('keshav') ||
                    userEmail.endsWith('@admin.com');

                console.warn('🚨 API call failed, using email-based admin detection:', { userEmail, isTemporaryAdmin });

                sessionStorage.setItem(sessionKey, JSON.stringify({
                    isAdmin: isTemporaryAdmin,
                    checkedAt: Date.now(),
                    temporary: true
                }));

                handleRedirect(isTemporaryAdmin);
            }

            setChecking(false);
            setHasChecked(true);
        }

        function handleRedirect(isAdmin) {
            if (isAdmin) {
                // Admin user
                if (pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/(main)')) {
                    console.log('🔄 Redirecting admin to admin dashboard');
                    router.push('/admin/dashboard');
                }
            } else {
                // Student user  
                if (pathname.startsWith('/admin')) {
                    console.log('🔄 Redirecting student to main dashboard');
                    router.push('/dashboard');
                }
            }
        }

        checkUserRole();
    }, [isLoaded, isSignedIn, user, router, pathname, checking, hasChecked]);

    return null;
}