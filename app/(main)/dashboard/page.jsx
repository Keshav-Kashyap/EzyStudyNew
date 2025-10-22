"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import HeroHeader from './_components/HeroHeader'
import PupularNotesGrid from './popular/_components/PupularNotesGrid'
import SearchFilterToolbar from '../_components/SearchFilterToolbar'

import {

    Search,
    BookOpen,
    Users,
    GraduationCap,
    Filter,
    Grid,
    List,
    Star,
    Loader2,
    ArrowBigRight,
    TrendingUp,
    MoveRight
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import CoursesCard from "./allCourses/_components/CoursesCard";

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
                        students: course.studentsCount || 0,
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
        // Show card skeletons instead of a spinner
        const GenericCardSkeleton = require('../_components/skeletons/GenericCardSkeleton').default;
        return (
            <div className="min-h-screen bg-white dark:bg-[rgb(38,38,36)] text-slate-900 dark:text-slate-100 transition-colors duration-300">
                <div className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <GenericCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
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

                        {/* Search and Filters Toolbar */}
                        <SearchFilterToolbar
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onFilterClick={() => console.log('Filter clicked')}
                        />





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
                        <PupularNotesGrid />

                        {/* View All Notes Button */}
                        <div className="mt-4 mb-8 flex justify-center">
                            <Link href="/dashboard/popular">
                                <Button
                                    variant="outline"
                                    className="h-11 px-8 border-2 border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                                >
                                    View all notes
                                    <MoveRight className="h-6 w-6 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <CoursesCard
                            courses={courses}
                            viewMode={viewMode}
                            searchQuery={searchQuery}
                        />

                        {/* View All Courses Button */}
                        <div className="mt-4 mb-8 flex justify-center">
                            <Link href="/dashboard/allCourses">
                                <Button
                                    variant="outline"
                                    className="h-11 px-8 border-2 border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                                >
                                    View all courses
                                    <MoveRight className="h-6 w-6 ml-2" />
                                </Button>
                            </Link>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}