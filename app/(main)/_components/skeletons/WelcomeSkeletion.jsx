"use client"
import React, { useContext } from 'react';


// Skeleton Loader Component
const WelcomeSkeletion = () => {
    return (
        <div className="p-6 rounded-lg bg-white dark:bg-[rgb(38,38,36)] border border-gray-300 dark:border-gray-700 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
                </div>

                <div className="text-right ml-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-100 dark:bg-[rgb(48,48,46)] border border-gray-300 dark:border-[rgb(60,60,58)]">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2"></div>
            </div>
        </div>
    );
};

export default WelcomeSkeletion;