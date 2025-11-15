"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart, Activity, RefreshCw, Database, HardDrive } from "lucide-react";
import { useAdminAnalytics } from '@/hooks/useAdminData';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminAnalytics() {
    const { data: analyticsData, isLoading } = useAdminAnalytics();
    const [storageData, setStorageData] = useState(null);
    const [loadingStorage, setLoadingStorage] = useState(true);

    const fetchStorageStats = async () => {
        try {
            setLoadingStorage(true);
            const response = await fetch('/api/admin/storage-stats');
            const result = await response.json();

            if (result.success) {
                setStorageData(result.data);
                if (!result.data.isConfigured) {
                    toast.warning('Supabase storage not configured');
                }
            } else {
                toast.error(result.error || 'Failed to fetch storage stats');
                setStorageData(null);
            }
        } catch (error) {
            console.error('Error fetching storage:', error);
            toast.error('Failed to fetch storage statistics');
            setStorageData(null);
        } finally {
            setLoadingStorage(false);
        }
    };

    useEffect(() => {
        fetchStorageStats();
    }, []);

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

    if (isLoading || loadingStorage) {
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
                <div className="flex items-center gap-2">
                    <Button
                        onClick={fetchStorageStats}
                        disabled={loadingStorage}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className={`w-4 h-4 mr-1 ${loadingStorage ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Badge variant="secondary">
                        <Activity className="w-4 h-4 mr-1" />
                        Real-time
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {storageData ? (
                            <>
                                <div className="text-2xl font-bold">
                                    {storageData.storageUsed >= 1
                                        ? `${storageData.storageUsed.toFixed(2)} GB`
                                        : `${(storageData.storageUsed * 1024).toFixed(0)} MB`
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    of {storageData.totalStorage} GB {storageData.isConfigured ? 'Supabase' : 'limit'}
                                </p>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${storageData.percentageUsed > 90 ? 'bg-red-600' :
                                                storageData.percentageUsed > 70 ? 'bg-yellow-600' :
                                                    'bg-blue-600'
                                            }`}
                                        style={{ width: `${Math.min(storageData.percentageUsed, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {storageData.filesCount} files • {storageData.percentageUsed.toFixed(1)}% used
                                </p>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Space</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {storageData ? (
                            <>
                                <div className="text-2xl font-bold text-green-600">
                                    {storageData.availableStorage >= 1
                                        ? `${storageData.availableStorage.toFixed(2)} GB`
                                        : `${(storageData.availableStorage * 1024).toFixed(0)} MB`
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    remaining storage
                                </p>
                                {!storageData.isConfigured && (
                                    <Badge variant="destructive" className="mt-2 text-xs">
                                        Not Connected
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        )}
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
                        {storageData ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Used Storage</span>
                                    <span className="font-medium">
                                        {storageData.storageUsed >= 1
                                            ? `${storageData.storageUsed.toFixed(2)} GB`
                                            : `${(storageData.storageUsed * 1024).toFixed(0)} MB`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Available</span>
                                    <span className="font-medium text-green-600">
                                        {storageData.availableStorage >= 1
                                            ? `${storageData.availableStorage.toFixed(2)} GB`
                                            : `${(storageData.availableStorage * 1024).toFixed(0)} MB`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Capacity</span>
                                    <span className="font-medium">{storageData.totalStorage} GB</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Files Count</span>
                                    <span className="font-medium">{storageData.filesCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Materials in DB</span>
                                    <span className="font-medium">{storageData.materialsInDb || 0}</span>
                                </div>
                                <div className="pt-2">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>Usage</span>
                                        <span>{storageData.percentageUsed.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${storageData.percentageUsed > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                    storageData.percentageUsed > 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                        'bg-gradient-to-r from-blue-500 to-blue-600'
                                                }`}
                                            style={{ width: `${Math.min(storageData.percentageUsed, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {storageData.lastUpdated && (
                                    <p className="text-xs text-muted-foreground pt-2">
                                        Last updated: {new Date(storageData.lastUpdated).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">Loading storage data...</div>
                        )}
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