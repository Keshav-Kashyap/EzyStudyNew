"use client";

export default function ReviewSkeleton() {
    const placeholders = Array.from({ length: 5 }, (_, i) => i);
    const topLoop = [...placeholders, ...placeholders, ...placeholders];
    const bottomLoop = [...placeholders, ...placeholders, ...placeholders];

    return (
        <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10 bg-gradient-to-r from-white dark:from-[rgb(38,38,36)] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10 bg-gradient-to-l from-white dark:from-[rgb(38,38,36)] to-transparent" />

            <div className="flex flex-col gap-5">
                <div className="overflow-hidden">
                    <div className="flex gap-5 w-max" style={{ animation: "scrollLeftSkeleton 45s linear infinite" }}>
                        {topLoop.map((item, idx) => (
                            <SkeletonCard key={`review-sk-top-${item}-${idx}`} />
                        ))}
                    </div>
                </div>

                <div className="overflow-hidden">
                    <div className="flex gap-5 w-max" style={{ animation: "scrollRightSkeleton 55s linear infinite" }}>
                        {bottomLoop.map((item, idx) => (
                            <SkeletonCard key={`review-sk-bottom-${item}-${idx}`} />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
				@keyframes scrollLeftSkeleton {
					0% { transform: translateX(0); }
					100% { transform: translateX(-33.333%); }
				}
				@keyframes scrollRightSkeleton {
					0% { transform: translateX(-33.333%); }
					100% { transform: translateX(0); }
				}
			`}</style>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="min-w-[290px] max-w-[290px] flex-shrink-0 rounded-2xl p-5 bg-white/90 dark:bg-[rgb(32,32,30)] border border-slate-200/90 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 w-28 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-3.5 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-3.5 w-[90%] rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-3.5 w-[80%] rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="h-4 w-16 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                <div className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
        </div>
    );
}
