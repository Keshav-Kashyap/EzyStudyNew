"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, ChevronDown, Calendar, GraduationCap, Loader2 } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';

const SemesterOverview = () => {
    const { code } = useParams();
    const router = useRouter();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch course data from API
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/courses/${code}`);
                const data = await response.json();

                if (data.success) {
                    setCourseData(data.course);
                } else {
                    throw new Error(data.error || 'Failed to fetch course data');
                }
            } catch (err) {
                console.error('Error fetching course data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            fetchCourseData();
        }
    }, [code]);

    // Default course data for fallback
    const defaultCourseData = {
        mca: {
            title: "MCA (Masters of Computer Application)",
            description: "Choose your semester to access relevant study materials",
            totalSemesters: 4,
            color: { primary: "blue", secondary: "purple" }
        },
        bca: {
            title: "BCA (Bachelor of Computer Application)",
            description: "Access comprehensive study materials for each semester",
            totalSemesters: 6,
            color: { primary: "green", secondary: "emerald" }
        },
        btech: {
            title: "B.Tech (Bachelor of Technology)",
            description: "Engineering study materials and resources",
            totalSemesters: 8,
            color: { primary: "orange", secondary: "red" }
        }
    };

    // Get current course configuration
    const getCourseConfig = () => {
        if (courseData) {
            return {
                title: courseData.title,
                description: courseData.description || "Choose your semester to access relevant study materials",
                totalSemesters: courseData.semesters?.length || 0,
                semesters: courseData.semesters || [],
                color: defaultCourseData[code?.toLowerCase()]?.color || { primary: "blue", secondary: "purple" }
            };
        }
        return defaultCourseData[code?.toLowerCase()] || defaultCourseData.mca;
    };

    const currentCourse = getCourseConfig();

    // Generate semesters from database data or fallback
    const getSemesters = () => {
        if (courseData?.semesters) {
            return courseData.semesters.map((semester, index) => ({
                id: semester.id,
                name: semester.name,
                description: semester.description,
                status: semester.isActive ? 'active' : 'upcoming',
                subjects: semester.subjects?.length || 0,
                documents: semester.subjects?.reduce((total, subject) =>
                    total + (subject.materials?.length || 0), 0) || 0
            }));
        }

        // Fallback to generated semesters
        const semesters = [];
        for (let i = 1; i <= currentCourse.totalSemesters; i++) {
            semesters.push({
                id: i,
                name: `Semester ${i}`,
                status: i <= 3 ? 'active' : 'upcoming',
                subjects: code === 'btech' ? 8 : 6,
                documents: code === 'btech' ? 75 : 50
            });
        }
        return semesters;
    };

    const semesters = getSemesters();

    const getStatusConfig = (status) => {
        const primaryColor = currentCourse.color.primary;
        const configs = {
            active: {
                badge: 'Active',
                badgeClass: `bg-${primaryColor}-500 text-white`,
                cardClass: `bg-white dark:bg-gray-800 border-${primaryColor}-200 dark:border-${primaryColor}-700 shadow-lg hover:shadow-xl`,
                buttonClass: `bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white`
            },
            upcoming: {
                badge: 'Upcoming',
                badgeClass: 'bg-gray-500 text-white',
                cardClass: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg opacity-90',
                buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white'
            }
        };
        return configs[status] || configs.active;
    };

    const getColorClasses = () => {
        const primary = currentCourse.color.primary;
        const secondary = currentCourse.color.secondary;

        return {
            gradient: `from-${primary}-600 to-${secondary}-600`,
            iconBg: `bg-${primary}-100 dark:bg-${primary}-900/30`,
            iconColor: `text-${primary}-600 dark:text-${primary}-400`,
            secondaryBg: `bg-${secondary}-100 dark:bg-${secondary}-900/30`,
            secondaryColor: `text-${secondary}-600 dark:text-${secondary}-400`,
            hoverGradient: `from-${primary}-500/10 to-${secondary}-500/10`
        };
    };

    const colors = getColorClasses();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">Loading course data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 mb-4 text-4xl">❌</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Course</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] p-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center`}>
                        <GraduationCap size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {currentCourse.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            {currentCourse.totalSemesters} Semester Course
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Notes Overview
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {currentCourse.description}
                    </p>
                </div>
            </div>

            {/* Semester Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semesters.map((semester) => {
                    const config = getStatusConfig(semester.status);

                    return (
                        <div
                            key={semester.id}
                            onClick={() => {
                                if (semester.status === 'active') {
                                    router.push(`/library/${code}/semester/${semester.id}`);
                                }
                            }}
                            className={`
                                ${config.cardClass}
                                border-2 rounded-2xl p-6 transition-all duration-300 
                                transform hover:-translate-y-1 cursor-pointer group
                                relative overflow-hidden
                                before:absolute before:inset-0 before:bg-gradient-to-r 
                                before:from-transparent before:via-blue-500/5 before:to-transparent
                                before:-translate-x-full hover:before:translate-x-full 
                                before:transition-transform before:duration-700
                                ${semester.status === 'upcoming' ? 'cursor-not-allowed' : ''}
                            `}
                        >
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {semester.name || `Semester ${semester.id}`}
                                </h3>
                                <span className={`
                                    px-3 py-1 rounded-full text-xs font-semibold
                                    ${config.badgeClass}
                                    transform group-hover:scale-110 transition-transform duration-300
                                `}>
                                    {config.badge}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className={`w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <BookOpen size={20} className={colors.iconColor} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{semester.subjects} Subjects</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Core & Elective</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className={`w-10 h-10 ${colors.secondaryBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <FileText size={20} className={colors.secondaryColor} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{semester.documents} Documents</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Notes & Materials</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {semester.status === 'active' ? (
                                <Link
                                    href={`/library/${code}/semester/${semester.id}`}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 rounded-xl
                                        ${config.buttonClass}
                                        font-medium transition-all duration-300
                                        transform group-hover:scale-105 shadow-lg
                                        text-center no-underline
                                    `}
                                >
                                    <span>View Materials</span>
                                    <ChevronDown size={20} className="transition-transform duration-300 group-hover:translate-y-1" />
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 rounded-xl
                                        ${config.buttonClass}
                                        font-medium transition-all duration-300
                                        transform group-hover:scale-105 shadow-lg
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                >
                                    <span>Coming Soon</span>
                                    <ChevronDown size={20} />
                                </button>
                            )}

                            {/* Decorative Elements */}
                            <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${colors.hoverGradient} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Info */}
            <div className="max-w-7xl mx-auto mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                    <Calendar size={20} className={colors.iconColor} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Academic Year 2024-25
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SemesterOverview;