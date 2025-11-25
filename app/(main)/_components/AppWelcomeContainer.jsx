"use client"
import React, { useContext } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import EzyLoader from './Loading'


import WelcomeSkeletion from './skeletons/WelcomeSkeletion'

const WelcomeContainer = () => {
    const { userDetail } = useContext(UserDetailContext);
    if (!userDetail) {
        return <WelcomeSkeletion />;
    }

    return (
        <div className="p-4 sm:p-6 mb-10 rounded-lg bg-white dark:bg-[rgb(38,38,36)] border border-gray-300 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex-1">

                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        Welcome to Ezy Learn, {userDetail?.name}!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Ready to continue your learning journey today?
                    </p>
                </div>

            </div>


        </div>
    );
};

export default WelcomeContainer;
