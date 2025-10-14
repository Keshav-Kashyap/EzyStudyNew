"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CoursesCard from "../_components/CoursesCard"
import {
    Search,
    BookOpen,
    Users,
    GraduationCap,
    Filter,
    Grid,
    List,
    Star,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [courses, setCourses] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch courses and dashboard stats on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch courses
                const coursesResponse = await fetch('/api/courses');
                const coursesData = await coursesResponse.json();

                if (coursesData) {
                    console.log(coursesData);
                }
                // Fetch dashboard stats
                const statsResponse = await fetch('/api/dashboard/stats');
                const statsData = await statsResponse.json();
                if (statsData) {
                    console.log(statsData)
                }

                if (coursesData.success) {
                    // Transform courses data to match the UI format
                    const transformedCourses = coursesData.courses.map(course => ({
                        id: course.id,
                        title: course.category,
                        subtitle: course.title,
                        description: course.description || "Comprehensive learning materials and resources.",
                        category: course.category,
                        documents: course.documentsCount || course.totalMaterials || 0,
                        students: `${Math.floor((course.studentsCount || 0) / 1000)}K` || "0K",
                        semesters: course.semesters || 0,
                        duration: course.duration,
                        image: course.image || getDefaultImage(course.category),
                        bgColor: course.bgColor || 'bg-blue-500'
                    }));
                    setCourses(transformedCourses);
                }

                if (statsData.success) {
                    setDashboardStats(statsData);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to get default images based on category
    const getDefaultImage = (category) => {
        const images = {
            'MCA': "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
            'BCA': "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
            'BTech': "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
        };
        return images[category] || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop";
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-slate-600 dark:text-slate-300">Loading courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 mb-4"></div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Data</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[rgb(38,38,36)] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200 dark:border-blue-800">
                                        <GraduationCap className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl lg:text-5xl font-bold mb-2 text-slate-900 dark:text-white">
                                            Course Library
                                        </h1>
                                        <p className="text-lg text-slate-600 dark:text-slate-300">
                                            Discover comprehensive learning materials designed for academic excellence
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                                    <div className="flex items-center gap-3 p-4 rounded-xl shadow-md border bg-white dark:bg-[rgb(24,24,24)]/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl text-slate-900 dark:text-white">
                                                {dashboardStats?.summary?.courses || courses.length}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Courses</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl shadow-md border bg-white dark:bg-[rgb(24,24,24)]/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl text-slate-900 dark:text-white">
                                                {dashboardStats?.summary?.students || '12K+'}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Students</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl shadow-md border bg-white dark:bg-[rgb(24,24,24)]/50 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                            <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl text-slate-900 dark:text-white">
                                                {dashboardStats?.summary?.rating || '4.8'}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Rating</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <Input
                                    placeholder="Search courses, categories, or topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-14 text-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[rgb(24,24,24)] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 border-gray-300 dark:border-gray-600"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="h-14 px-6 shadow-sm border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-transparent"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>

                                <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-300 dark:border-gray-600">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className={`rounded-none h-14 px-4 ${viewMode === "grid"
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className={`rounded-none h-14 px-4 ${viewMode === "list"
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        {searchQuery && (
                            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <p className="text-slate-700 dark:text-slate-300">
                                    Found <span className="font-bold text-blue-600 dark:text-blue-400">{filteredCourses.length}</span> courses
                                    {searchQuery && ` for "${searchQuery}"`}
                                </p>
                            </div>
                        )}

                        {/* Course Grid */}
                        <CoursesCard
                            courses={courses}
                            viewMode={viewMode}
                            searchQuery={searchQuery}
                        />

                    </div>
                </main>
            </div>
        </div>
    );
}