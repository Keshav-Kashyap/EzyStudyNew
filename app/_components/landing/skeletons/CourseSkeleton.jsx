"use client";

export default function CourseSkeleton({
    count = 3,
    wrapperClassName = "grid md:grid-cols-3 gap-8",
}) {
    return (
        <div className={wrapperClassName}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="group rounded-xl overflow-hidden border border-gray-200/90 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
                >
                    <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100 dark:from-slate-700 dark:to-slate-800 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-4 right-4 h-7 w-24 rounded-full bg-white/70 dark:bg-slate-600/70 animate-pulse" />
                    </div>

                    <div className="p-6">
                        <div className="h-7 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mb-3" />
                        <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
                        <div className="h-4 w-4/5 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mb-5" />

                        <div className="flex items-center justify-between mb-5">
                            <div className="h-4 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 w-16 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </div>

                        <div className="h-11 w-full rounded-lg bg-blue-200 dark:bg-blue-900/50 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}
