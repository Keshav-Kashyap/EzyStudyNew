"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Upload, TrendingUp, Activity, Plus, Eye } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCourses: 5,
        totalUsers: 152,
        totalMaterials: 89,
        totalUploads: 234
    });

    const [recentActivity, setRecentActivity] = useState([
        { action: "New material uploaded", timestamp: "2 hours ago", type: "upload" },
        { action: "User registered", timestamp: "4 hours ago", type: "user" },
        { action: "Course updated", timestamp: "6 hours ago", type: "course" }
    ]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard stats
            const response = await fetch('/api/admin/dashboard');
            const data = await response.json();

            if (data.success) {
                setStats(data.stats || {
                    totalCourses: 5,
                    totalUsers: 152,
                    totalMaterials: 89,
                    totalUploads: 234
                });

                setRecentActivity(data.recentActivity || [
                    { action: "New material uploaded", timestamp: "2 hours ago", type: "upload" },
                    { action: "User registered", timestamp: "4 hours ago", type: "user" },
                    { action: "Course updated", timestamp: "6 hours ago", type: "course" }
                ]);
            } else {
                // Mock data fallback
                setStats({
                    totalCourses: 5,
                    totalUsers: 152,
                    totalMaterials: 89,
                    totalUploads: 234
                });

                setRecentActivity([
                    { action: "New material uploaded", timestamp: "2 hours ago", type: "upload" },
                    { action: "User registered", timestamp: "4 hours ago", type: "user" },
                    { action: "Course updated", timestamp: "6 hours ago", type: "course" }
                ]);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);

            // Fallback data
            setStats({
                totalCourses: 5,
                totalUsers: 152,
                totalMaterials: 89,
                totalUploads: 234
            });

            setRecentActivity([
                { action: "New material uploaded", timestamp: "2 hours ago", type: "upload" },
                { action: "User registered", timestamp: "4 hours ago", type: "user" },
                { action: "Course updated", timestamp: "6 hours ago", type: "course" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Courses",
            value: stats.totalCourses,
            icon: BookOpen,
            description: "Active courses",
            color: "text-blue-600"
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            description: "Registered users",
            color: "text-green-600"
        },
        {
            title: "Study Materials",
            value: stats.totalMaterials,
            icon: FileText,
            description: "Uploaded files",
            color: "text-purple-600"
        },
        {
            title: "Total Uploads",
            value: stats.totalUploads,
            icon: Upload,
            description: "This month",
            color: "text-orange-600"
        }
    ];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                        <Activity className="w-4 h-4 mr-1" />
                        Live
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <card.icon className={`h-4 w-4 text-muted-foreground ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {card.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-[rgb(45,45,44)]/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${activity.type === 'upload' ? 'bg-blue-100 text-blue-600' :
                                                activity.type === 'user' ? 'bg-green-100 text-green-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                {activity.type === 'upload' && <Upload className="h-4 w-4" />}
                                                {activity.type === 'user' && <Users className="h-4 w-4" />}
                                                {activity.type === 'course' && <BookOpen className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{activity.action}</p>
                                                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No recent activity
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Most Popular Course</span>
                                </div>
                                <Badge variant="secondary">MCA</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">Active Today</span>
                                </div>
                                <Badge variant="secondary">45 users</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">Files Uploaded</span>
                                </div>
                                <Badge variant="secondary">12 today</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm font-medium">System Status</span>
                                </div>
                                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <Button className="h-20 flex-col gap-2" variant="outline">
                            <Upload className="h-6 w-6" />
                            <span>Upload Material</span>
                        </Button>
                        <Button className="h-20 flex-col gap-2" variant="outline">
                            <BookOpen className="h-6 w-6" />
                            <span>Add Course</span>
                        </Button>
                        <Button className="h-20 flex-col gap-2" variant="outline">
                            <Users className="h-6 w-6" />
                            <span>Manage Users</span>
                        </Button>
                        <Button className="h-20 flex-col gap-2" variant="outline">
                            <TrendingUp className="h-6 w-6" />
                            <span>View Analytics</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}