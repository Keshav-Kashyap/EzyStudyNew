"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { courses } from '../../../services/constant'
import {
    Brain,
    Search,
    BookOpen,
    Users,
    FileText,
    Bell,
    Home,
    User,
    GraduationCap,
    Code,
    Palette,
    BarChart,
    Filter,
    Grid,
    List,
    Star,
    Clock,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen dark  dark:bg-[rgba(38,38,36,1)] text-gray-900 dark:text-white transition-colors duration-300">
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400">
                                        <GraduationCap className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">Course Library</h1>
                                        <p className="text-lg text-gray-600 dark:text-gray-300">
                                            Discover comprehensive learning materials designed for academic excellence
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 mb-6">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <span className="font-semibold">{courses.length}</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Courses
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-semibold">12K+</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Students
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                        <span className="font-semibold">4.8</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Rating
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Search courses, categories, or topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>

                                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="rounded-none"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="rounded-none"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        {searchQuery && (
                            <div className="mb-6">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Found <span className="font-semibold">{filteredCourses.length}</span> courses
                                    {searchQuery && ` for "${searchQuery}"`}
                                </p>
                            </div>
                        )}

                        {/* Course Grid */}
                        <div className={`grid gap-6 ${viewMode === "grid"
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1'
                            }`}>
                            {filteredCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg"
                                >
                                    {/* Course Header */}
                                    <div className={`relative h-40 bg-gradient-to-br ${course.bgColor} overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
                                            <div>
                                                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                                    {course.image}
                                                </div>
                                                <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
                                                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                                    {course.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Trending Badge */}
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-yellow-500 text-yellow-900 border-0">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                Popular
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                            {course.subtitle}
                                        </CardTitle>
                                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                            {course.description}
                                        </p>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        {/* Course Stats */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-6">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        {course.documents} docs
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        {course.students}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    4.8
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5">
                                                Start Learning
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Preview
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredCourses.length === 0 && searchQuery && (
                            <div className="text-center py-16">
                                <Search className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-300">
                                    No courses found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Try adjusting your search terms or browse all courses
                                </p>
                                <Button
                                    onClick={() => setSearchQuery("")}
                                    className="mt-4"
                                >
                                    Clear Search
                                </Button>
                            </div>
                        )}

                        {/* Back to Home */}
                        <div className="mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="inline-flex items-center space-x-2 px-8 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Home className="h-5 w-5" />
                                    <span>Back to Home</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}