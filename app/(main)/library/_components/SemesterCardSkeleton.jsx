import React from 'react';

const SemesterCardSkeleton = () => {
    return (
        <div className="relative bg-white dark:bg-[rgb(24,24,24)] rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-900/30 overflow-hidden">
            <div className="animate-pulse">
                <div className="flex items-start justify-between mb-6">
                    <div className="space-y-2">
                        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded-md" />
                    </div>
                    <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl" />
                        <div className="space-y-2">
                            <div className="h-7 w-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <style jsx>{`
				@keyframes shimmer {
					100% {
						transform: translateX(100%);
					}
				}
			`}</style>
        </div>
    );
};

export default SemesterCardSkeleton;
