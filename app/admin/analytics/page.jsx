"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import { useAdminAnalytics } from '@/hooks/useAdminData';

export default function AdminAnalytics() {
    const { data: analyticsData, isLoading } = useAdminAnalytics();

    const analytics = analyticsData || {
        storageUsed: 2.4,
        totalDownloads: 1234,
        popularFileTypes: [
            { type: 'PDF', percentage: 65, count: 450 },
            { type: 'DOC', percentage: 20, count: 138 },
            { type: 'PPT', percentage: 15, count: 103 }
        ],
        activeUsers: 89
    };

    if (isLoading) {
        return (
            <div className="p-6">
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

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
                <Badge variant="secondary">
                    <Activity className="w-4 h-4 mr-1" />
                    Real-time
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.storageUsed} GB</div>
                        <p className="text-xs text-muted-foreground">of 25 GB free tier</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(analytics.storageUsed / 25) * 100}%` }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalDownloads.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Popular Format</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">PDF</div>
                        <p className="text-xs text-muted-foreground">65% of all uploads</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">in last 24 hours</p>
                    </CardContent>
                </Card>
            </div>

            {/* File Type Analytics */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>File Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.popularFileTypes.map((fileType, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' :
                                            index === 1 ? 'bg-green-500' :
                                                'bg-yellow-500'
                                            }`}></div>
                                        <span className="font-medium">{fileType.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">{fileType.count} files</span>
                                        <Badge variant="secondary">{fileType.percentage}%</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Storage Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Used Storage</span>
                                <span className="font-medium">{analytics.storageUsed} GB</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Available</span>
                                <span className="font-medium text-green-600">{(25 - analytics.storageUsed).toFixed(1)} GB</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Total Capacity</span>
                                <span className="font-medium">25 GB</span>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Usage</span>
                                    <span>{((analytics.storageUsed / 25) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(analytics.storageUsed / 25) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                        <p>Detailed analytics charts coming soon...</p>
                        <p className="text-sm">Connect to analytics service for detailed insights</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}