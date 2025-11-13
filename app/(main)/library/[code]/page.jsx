"use client"
import React, { useContext } from 'react';
import { Calendar, GraduationCap, Loader2 } from 'lucide-react';
import { useParams } from "next/navigation";
import SemesterCard from './../_components/SemesterCard'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCourseDetail } from '@/hooks/useCourses';

const SemesterOverview = () => {
    const { code } = useParams();
    const { data: courseData, isLoading, isError, error } = useCourseDetail(code);
    const { user } = useUser();
    const { userDetail } = useContext(UserDetailContext);
    const isAdmin = userDetail?.role === "admin";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">Loading course data...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl"></span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Error Loading Course
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error?.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {courseData.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
                            {courseData.semesters?.length || 0} Semester Program
                        </p>
                    </div>
                    <div className="flex justify-end mb-4">
                        {isAdmin && (
                            <Button
                                className="bg-[#3e3e3a] hover:bg-[#50504c] text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Create Semester
                            </Button>
                        )}
                    </div>




                </div>

                <div className="bg-white dark:bg-[rgb(24,24,24)] rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                        Course Overview
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {courseData.description || "Access comprehensive study materials, notes, and resources for each semester."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseData.semesters?.map((semester) => (
                        <SemesterCard
                            key={semester.id}
                            semester={semester}
                            code={code}
                            basePath={isAdmin ? "admin/library" : "library"}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-[rgb(24,24,24)] rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                        <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Academic Year 2024-25
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SemesterOverview;