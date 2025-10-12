"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function AdminSetupPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [loading, setLoading] = useState(false);
    const [adminStatus, setAdminStatus] = useState(null);

    const checkAdminStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/check-auth');
            const result = await response.json();
            setAdminStatus(result);

            if (result.success) {
                toast.success(`Status: ${result.isAdmin ? 'Admin' : 'Student'}`);
            }
        } catch (error) {
            toast.error('Failed to check admin status');
        }
        setLoading(false);
    };

    const makeMeAdmin = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/make-me-admin', {
                method: 'POST'
            });
            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                checkAdminStatus(); // Refresh status
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to make admin');
        }
        setLoading(false);
    };

    const registerUser = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST'
            });
            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                checkAdminStatus(); // Refresh status
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to register user');
        }
        setLoading(false);
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return (
            <div className="container mx-auto p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Please Login First</CardTitle>
                        <CardDescription>You need to be logged in to access admin setup</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Setup & Testing</CardTitle>
                    <CardDescription>
                        Setup admin access and test database integration
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <Button
                            onClick={registerUser}
                            disabled={loading}
                            variant="outline"
                        >
                            Register in Database
                        </Button>

                        <Button
                            onClick={checkAdminStatus}
                            disabled={loading}
                            variant="outline"
                        >
                            Check Status
                        </Button>

                        <Button
                            onClick={makeMeAdmin}
                            disabled={loading}
                            variant="default"
                        >
                            Make Me Admin
                        </Button>
                    </div>

                    {adminStatus && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Authenticated:</strong> {adminStatus.isAuthenticated ? '' : ''}</p>
                                    <p><strong>Admin:</strong> {adminStatus.isAdmin ? '' : ''}</p>
                                    {adminStatus.user && (
                                        <>
                                            <p><strong>Name:</strong> {adminStatus.user.name}</p>
                                            <p><strong>Email:</strong> {adminStatus.user.email}</p>
                                            <p><strong>Role:</strong> {adminStatus.user.role}</p>
                                            <p><strong>Active:</strong> {adminStatus.user.isActive ? '' : ''}</p>
                                        </>
                                    )}
                                    {adminStatus.message && (
                                        <p><strong>Message:</strong> {adminStatus.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Your Clerk Info:</h3>
                        <p><strong>User ID:</strong> {user.id}</p>
                        <p><strong>Email:</strong> {user.emailAddresses?.[0]?.emailAddress}</p>
                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}