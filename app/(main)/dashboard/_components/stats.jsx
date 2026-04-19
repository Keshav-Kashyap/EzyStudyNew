"use client";

import { BookOpen, Layers3, FileText, Star } from "lucide-react";

const defaultStats = {
    totalCourses: 0,
    totalSemesters: 0,
    totalMaterials: 0,
    averageRating: 0,
};

const Stats = ({ stats = defaultStats }) => {
    const safeStats = { ...defaultStats, ...(stats || {}) };

    const cards = [
        {
            title: "Total Courses",
            value: safeStats.totalCourses,
            icon: BookOpen,
            tone: "from-blue-500 to-cyan-500",
        },
        {
            title: "Total Semesters",
            value: safeStats.totalSemesters,
            icon: Layers3,
            tone: "from-emerald-500 to-teal-500",
        },
        {
            title: "Study Material",
            value: safeStats.totalMaterials,
            icon: FileText,
            tone: "from-orange-500 to-amber-500",
        },
        {
            title: "Average Rating",
            value: Number(safeStats.averageRating || 0).toFixed(1),
            icon: Star,
            tone: "from-pink-500 to-rose-500",
        },
    ];

    return (
        <section className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/80"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{item.title}</p>
                                <div className={`rounded-xl bg-gradient-to-br p-2 text-white ${item.tone}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Stats;
