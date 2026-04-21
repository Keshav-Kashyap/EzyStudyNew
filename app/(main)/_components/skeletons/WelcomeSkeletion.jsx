"use client"
import React, { useContext } from 'react';


// Skeleton Loader Component
const WelcomeSkeletion = () => {
    return (
        <div className="p-4 sm:p-6 rounded-lg mb-5 bg-white dark:bg-[rgb(38,38,36)] border border-gray-300 dark:border-gray-700 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
                <div className="flex-1">
                    <div className="h-7 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-80"></div>
                </div>

                <div className="sm:text-right sm:ml-4 flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-48"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-40"></div>
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-[rgb(48,48,46)] border border-gray-300 dark:border-[rgb(60,60,58)]">
                <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-5/6 mt-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 sm:w-3/4 mt-2"></div>
            </div>
        </div>
    );
};

export default WelcomeSkeletion;