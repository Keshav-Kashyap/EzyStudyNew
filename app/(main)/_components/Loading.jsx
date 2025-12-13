import React from 'react';

const EzyLoader = () => {
    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[rgb(38,38,36)] transition-colors duration-500"
        >
            <div className="text-center">
                {/* EZY Text Animation */}
                <div className="text-6xl font-bold text-black dark:text-white mb-8">
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>
                        E
                    </span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '200ms' }}>
                        Z
                    </span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '400ms' }}>
                        Y
                    </span>
                </div>

                {/* Loading dots */}
                <div className="flex space-x-2 justify-center">
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default EzyLoader;