"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List } from "lucide-react";
import CreateCourseForm from "./_components/CreateNewCourse";
import StatsCards from "./_components/StatusCards";
import CoursesCard from "../../(main)/_components/CoursesCard";

export default function AdminLibraryPage() {
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch admin courses
            const adminCoursesRes = await fetch("/api/admin/courses");
            const adminCoursesData = await adminCoursesRes.json();
            console.log("Admin courses data:", adminCoursesData);

            // Fetch user courses (for display purposes)
            const userCoursesRes = await fetch("/api/courses");
            const userCoursesData = await userCoursesRes.json();
            console.log("User courses data:", userCoursesData);

            // Combine both admin and user courses
            let allCourses = [];
            if (adminCoursesData.success && adminCoursesData.courses) {
                allCourses = [...allCourses, ...adminCoursesData.courses];
            }
            if (userCoursesData.success && userCoursesData.courses) {
                // Transform user courses to match admin format
                const transformedUserCourses = userCoursesData.courses.map(course => ({
                    id: `user_${course.id}`, // Add prefix to avoid ID conflicts
                    name: course.title,
                    code: course.category,
                    description: course.description,
                    category: course.category,
                    duration: course.category === 'MCA' ? 2 : course.category === 'BCA' ? 3 : 4,
                    totalSemesters: course.semesters || 0,
                    isActive: course.isActive,
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt,
                    isUserCourse: true // Flag to identify user courses
                }));
                allCourses = [...allCourses, ...transformedUserCourses];
            }

            setCourses(allCourses);

            // Fetch semesters
            const semestersRes = await fetch("/api/admin/semesters");
            const semestersData = await semestersRes.json();
            console.log("Admin semesters data:", semestersData);
            if (semestersData.success) setSemesters(semestersData.semesters || []);

            // Fetch subjects
            const subjectsRes = await fetch("/api/admin/subjects");
            const subjectsData = await subjectsRes.json();
            console.log("Admin subjects data:", subjectsData);
            if (subjectsData.success) setSubjects(subjectsData.subjects || []);

            // Fetch materials
            const materialsRes = await fetch("/api/admin/materials");
            const materialsData = await materialsRes.json();
            console.log("Admin materials data:", materialsData);
            if (materialsData.success) setMaterials(materialsData.materials || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getDefaultImage = (category) => {
        const images = {
            'MCA': "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
            'BCA': "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
            'BTech': "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
            'General': "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
        };
        return images[category] || images['General'];
    };

    // Transform courses data to match CoursesCard format
    const transformedCourses = courses.map(course => ({
        id: course.id,
        title: course.category || course.name || course.title,
        subtitle: course.name || course.title,
        description: course.description || "Course management and material upload.",
        category: course.category || course.code || 'General',
        documents: materials.filter(m => m.courseId === course.id).length || 0,
        students: course.isUserCourse ? `${Math.floor(Math.random() * 500)}+` : `${Math.floor(Math.random() * 100)}+`,
        semesters: course.totalSemesters || semesters.filter(s => s.category === course.category).length || 0,
        duration: course.duration ? `${course.duration} Year${course.duration > 1 ? 's' : ''}` : '1 Year',
        image: getDefaultImage(course.category || course.code || 'General'),
        bgColor: 'bg-blue-500',
        isUserCourse: course.isUserCourse || false
    }));

    // Function to get default images based on category


    if (loading) {
        return (
            <div className="flex items-center dark:bg-[rgb(38,38,36)] justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading library data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container dark:bg-[rgb(38,38,36)] mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Library Management System</h1>
                    <p className="text-gray-600 mt-2 ">Complete course, semester, subject & material management</p>
                </div>

            </div>

            <StatsCards
                courses={courses}
                semesters={semesters}
                subjects={subjects}
                materials={materials}
            />

            {/* Search and Filters - Admin */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                        placeholder="Search courses, categories, or materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 text-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-12 px-6 shadow-sm"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>

                    <div className="flex rounded-lg overflow-hidden shadow-sm border">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={`rounded-none h-12 px-4 ${viewMode === "grid"
                                ? "bg-blue-600 text-white"
                                : "text-slate-700 hover:text-slate-900"
                                }`}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={`rounded-none h-12 px-4 ${viewMode === "list"
                                ? "bg-blue-600 text-white"
                                : "text-slate-700 hover:text-slate-900"
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Course Grid - Admin */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Course Management</h2>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {transformedCourses.length} course{transformedCourses.length !== 1 ? 's' : ''} found
                    </div>
                </div>
                <CoursesCard
                    courses={transformedCourses}
                    viewMode={viewMode}
                    searchQuery={searchQuery}
                    isAdmin={true}
                    baseRoute="/admin/courses"
                />
            </div>
        </div>
    );
}