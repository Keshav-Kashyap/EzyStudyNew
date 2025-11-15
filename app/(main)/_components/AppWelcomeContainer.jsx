"use client"
import React, { useContext } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import EzyLoader from './Loading'


import WelcomeSkeletion from './skeletons/WelcomeSkeletion'

const WelcomeContainer = () => {
    const { userDetail } = useContext(UserDetailContext);
    const currentDate = new Date();

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
    const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);

    const getGreeting = () => {
        const hour = currentDate.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (!userDetail) {
        return <WelcomeSkeletion />;
    }

    return (
        <div className="p-4 sm:p-6 rounded-lg bg-white dark:bg-[rgb(38,38,36)] border border-gray-300 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        {getGreeting()}, {userDetail?.name}!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Ready to continue your learning journey today?
                    </p>
                </div>

                <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                        <span className="truncate">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="sm:w-4 sm:h-4" />
                        <span>{formattedTime}</span>
                    </div>
                </div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-[rgb(48,48,46)] border border-gray-300 dark:border-[rgb(60,60,58)]">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Quick Tip:</span>{' '}
                    Check out the latest resources in your library sections to stay updated with your coursework.
                </p>
            </div>
        </div>
    );
};

export default WelcomeContainer;
