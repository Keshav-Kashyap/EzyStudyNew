

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const WelcomeContainer = () => {
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

    return (
        <div
            className="p-6 rounded-lg text-white"
            style={{ backgroundColor: 'rgb(38, 38, 36)', border: '1px solid rgb(50, 50, 48)' }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {getGreeting()}, Student! 👋
                    </h1>
                    <p className="text-gray-400">
                        Ready to continue your learning journey today?
                    </p>
                </div>

                <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                        <Calendar size={16} />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={16} />
                        <span>{formattedTime}</span>
                    </div>
                </div>
            </div>

            <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'rgb(48, 48, 46)', border: '1px solid rgb(60, 60, 58)' }}
            >
                <p className="text-sm text-gray-300">
                    <span className="font-semibold text-blue-400">Quick Tip:</span> Check out the latest resources in your library sections to stay updated with your coursework.
                </p>
            </div>
        </div>
    );
};

export default WelcomeContainer;