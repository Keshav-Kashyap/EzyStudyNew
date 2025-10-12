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
                }
            } catch (error) {
                console.error(' Error checking user role:', error);
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