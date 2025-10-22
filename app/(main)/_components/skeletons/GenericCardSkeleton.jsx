import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const GenericCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <div className="relative">
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-10 h-6 rounded-md bg-gray-300 dark:bg-gray-600 animate-pulse" />
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <div className="w-8 h-5 rounded bg-gray-300 dark:bg-gray-600 animate-pulse" />
                </div>
            </div>

            <CardHeader className="pb-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                        <div className="w-20 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </CardContent>
        </Card>
    );
};

export default GenericCardSkeleton;
