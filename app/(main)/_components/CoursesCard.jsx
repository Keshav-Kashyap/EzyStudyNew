"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import {
    Users,
    FileText,
    Star,
    TrendingUp,
    Upload,
    Edit,
    Settings,
    GraduationCap,
    MoreVertical,
    Trash2
} from "lucide-react";
import Link from "next/link";
import GenericCard from "./shared/GenericCard";
import HeroHeader from "../dashboard/_components/HeroHeader";
import GenericCardSkeleton from './skeletons/GenericCardSkeleton';
import CourseActions from "@/app/admin/library/_components/CourseActions";


const CoursesCard = ({ courses, viewMode, searchQuery = '', isAdmin = false, baseRoute = "/library", onUpdate }) => {
    const router = useRouter();

    // Local state when component should fetch its own data
    const [localCourses, setLocalCourses] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // If no `courses` prop is provided, fetch courses locally so this component
    // can be used standalone on other pages.
    useEffect(() => {
        if (courses !== undefined) return; // parent supplied data

        let mounted = true;
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/courses');
                const data = await res.json();
                if (!mounted) return;

                if (data && data.success) {
                    const transformed = data.courses.map(course => ({
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
                    setLocalCourses(transformed);
                } else {
                    setLocalCourses([]);
                }
            } catch (err) {
                console.error('Error fetching courses in CoursesCard:', err);
                setError(err?.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();

        return () => { mounted = false; };
    }, [courses]);

    const effectiveCourses = courses ?? localCourses ?? [];
    const filteredCourses = effectiveCourses.filter(course =>
        (course.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (course.category || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (course.description || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );
    return (
        <>


            <HeroHeader className="mt-14" heading="Courses Library" subHeading=" Discover comprehensive learning materials designed for academic excellence" icon={GraduationCap} />


            {loading && courses === undefined ? (
                <div className="grid mb-15 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <GenericCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className={`grid mb-15 gap-6 ${viewMode === "grid"
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                    }`}>
                    {filteredCourses.map((course) => (
                        <GenericCard
                            key={course.id || course.title}
                            item={course}
                            imageUrl={course.image}
                            title={course.title}
                            subtitle={course.subtitle}
                            description={course.description}
                            badges={[
                                { label: 'Popular', position: 'top-right', bgColor: 'bg-yellow-400 text-yellow-900' },
                                { label: course.category, position: 'top-left', bgColor: 'bg-white/20 text-white' }
                            ]}
                            stats={[
                                {
                                    icon: <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                                    label: 'docs',
                                    value: course.documents,
                                    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
                                },
                                {
                                    icon: <Users className="w-4 h-4 text-green-600 dark:text-green-400" />,
                                    label: '',
                                    value: course.students,
                                    bgColor: 'bg-green-100 dark:bg-green-900/30'
                                }
                            ]}
                            actions={
                                isAdmin ? [
                                    {
                                        label: 'Manage Course',
                                        href: `${baseRoute}/${course.code || course.category}`,
                                        fullWidth: true
                                    }
                                ] : [
                                    {
                                        label: 'Start Learning',
                                        href: `${baseRoute}/${course.category}`,
                                        fullWidth: true
                                    }
                                ]
                            }
                            adminActions={
                                isAdmin ? (
                                    <CourseActions
                                        course={{
                                            id: course.id,
                                            name: course.subtitle || course.title,
                                            code: course.code || course.category,
                                            description: course.description,
                                            duration: course.duration || 3
                                        }}
                                        onUpdate={onUpdate}
                                    />
                                ) : null
                            }
                        />
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

export default CoursesCard;






