"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, UserPlus, Shield, Mail, Calendar } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredUsers(
                users.filter(user =>
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();

            if (data.success) {
                setUsers(data.users || []);
                setFilteredUsers(data.users || []);
            } else {
                // Mock data if API doesn't exist yet
                const mockUsers = [
                    {
                        id: 1,
                        name: "Keshav Kashyap",
                        email: "keshav@example.com",
                        role: "admin",
                        status: "active",
                        createdAt: "2024-01-15",
                        lastLogin: "2024-01-20"
                    },
                    {
                        id: 2,
                        name: "John Doe",
                        email: "john@example.com",
                        role: "student",
                        status: "active",
                        createdAt: "2024-01-10",
                        lastLogin: "2024-01-19"
                    },
                    {
                        id: 3,
                        name: "Jane Smith",
                        email: "jane@example.com",
                        role: "student",
                        status: "active",
                        createdAt: "2024-01-08",
                        lastLogin: "2024-01-18"
                    }
                ];
                setUsers(mockUsers);
                setFilteredUsers(mockUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback to mock data
            const mockUsers = [
                {
                    id: 1,
                    name: "Admin User",
                    email: "admin@ezylearn.com",
                    role: "admin",
                    status: "active",
                    createdAt: "2024-01-01",
                    lastLogin: "2024-01-20"
                }
            ];
            setUsers(mockUsers);
            setFilteredUsers(mockUsers);
        } finally {
            setLoading(false);
        }
    };

    const getUserRoleBadge = (role) => {
        const roleColors = {
            admin: "bg-red-100 text-red-800 border-red-200",
            student: "bg-blue-100 text-blue-800 border-blue-200",
            teacher: "bg-green-100 text-green-800 border-green-200"
        };

        return (
            <Badge className={roleColors[role] || "bg-gray-100 text-gray-800 border-gray-200"}>
                {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </Badge>
        );
    };

    const getStatusBadge = (status) => {
        return (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                <div className={`w-2 h-2 rounded-full mr-2 ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                        <p className="text-xs text-muted-foreground">Admin accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => u.role === 'student').length}</div>
                        <p className="text-xs text-muted-foreground">Student accounts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-[rgb(45,45,44)]/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-white font-medium text-lg">
                                                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-medium">{user.name || 'Unknown User'}</h3>
                                                {getUserRoleBadge(user.role)}
                                                {getStatusBadge(user.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email || 'No email'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="mx-auto h-12 w-12 mb-4" />
                                <p className="text-lg font-medium mb-2">No users found</p>
                                <p>Try adjusting your search terms or add new users</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}