"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    FileText,
    Star,
    TrendingUp,
    Upload,
    Edit,
    Settings
} from "lucide-react";
import Link from "next/link";

const CoursesCard = ({ courses, viewMode, searchQuery, isAdmin = false, baseRoute = "/library" }) => {
    // Function to get default images based on category
    const getDefaultImage = (category) => {
        const images = {
            'MCA': "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
            'BCA': "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
            'BTech': "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
        };
        return images[category] || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop";
    };

    const filteredCourses = courses?.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    return (
        <>
            {filteredCourses.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === "grid"
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                    }`}>
                    {filteredCourses.map((course) => (
                        <Card
                            key={course.id}
                            className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] shadow-lg border bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                        >
                            {/* Course Header */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="relative z-10 flex items-center justify-center h-full text-center text-white p-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{course.title}</h3>
                                        <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 shadow-lg">
                                            {course.category}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Trending Badge */}
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-yellow-400 text-yellow-900 border-0 shadow-lg font-semibold">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Popular
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                    {course.subtitle}
                                </CardTitle>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {course.description}
                                </p>
                            </CardHeader>

                            <CardContent className="pt-0">
                                {/* Course Stats */}
                                <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/20">
                                                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {course.documents} docs
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="p-1 rounded bg-green-100 dark:bg-green-900/20">
                                                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {course.students}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            4.8
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex gap-2">
                                    {isAdmin ? (
                                        <>
                                            <Link href={`/admin/library/${course.category}`} className="flex-1">
                                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Materials
                                                </Button>
                                            </Link>
                                            <Link href={`/ admin / courses / ${course.category} /edit`} className="w-auto">
                                                <Button variant="outline" className="px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href={`${baseRoute}/${course.category}`} className="w-full">
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                                                Start Learning
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div >
            ) : (
                <div className="text-center py-20">
                    <div className="text-slate-500 text-lg">
                        {searchQuery ? 'No courses found matching your search.' : 'No courses available.'}
                    </div>
                </div>
            )}
        </>
    )
}

export default CoursesCard






