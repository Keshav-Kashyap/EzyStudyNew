"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserRoleInfo() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [roleInfo, setRoleInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function checkRole() {
            if (!isLoaded || !isSignedIn || !user) return;

            setLoading(true);
            try {
                const response = await fetch('/api/users/role');
                const result = await response.json();
                setRoleInfo(result);
            } catch (error) {
                console.error('Error checking role:', error);
            }
            setLoading(false);
        }

        checkRole();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded || loading) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return null;
    }

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>User Role Info</CardTitle>
                <CardDescription>Current user authentication status</CardDescription>
            </CardHeader>
            <CardContent>
                {roleInfo && (
                    <div className="space-y-2">
                        <p><strong>Status:</strong> {roleInfo.success ? '' : ''}</p>
                        <p><strong>Authenticated:</strong> {roleInfo.isAuthenticated ? '' : ''}</p>
                        <p><strong>Admin:</strong> {roleInfo.isAdmin ? 'Admin' : '👤 Student'}</p>
                        {roleInfo.user && (
                            <>
                                <p><strong>Name:</strong> {roleInfo.user.name}</p>
                                <p><strong>Email:</strong> {roleInfo.user.email}</p>
                                <p><strong>Role:</strong> {roleInfo.user.role}</p>
                            </>
                        )}
                        {roleInfo.message && (
                            <p><strong>Message:</strong> {roleInfo.message}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}