"use client"

import React, { useContext } from 'react';
import { BookOpen, FileText, ChevronRight, Lock } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { UserDetailContext } from '@/context/UserDetailContext';

const SemesterCard = ({ basePath, semester, code }) => {
    const router = useRouter();
    const { userDetail } = useContext(UserDetailContext);
    const isActive = semester.isActive;

    console.log("SemesterCard - UserDetail:", userDetail);
    console.log("SemesterCard - BasePath prop:", basePath);

    // Determine the correct base path based on user role
    const getBasePath = () => {
        if (basePath) return basePath;
        return userDetail?.role === 'admin' ? 'admin/library' : 'library';
    };

    const finalBasePath = getBasePath();
    console.log("SemesterCard - Final BasePath:", finalBasePath);

    return (
        <div
            onClick={() => isActive && router.push(`/${finalBasePath}/${code}/semester/${semester.id}`)}
            className={`
                group relative bg-white dark:bg-gray-800 rounded-2xl p-6 
                border-2 transition-all duration-300 overflow-hidden
                ${isActive
                    ? 'border-blue-200 dark:border-blue-700 hover:shadow-2xl hover:-translate-y-1 cursor-pointer'
                    : 'border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed'
                }
            `}
        >
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {semester.name}
                        </h3>
                        {semester.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {semester.description}
                            </p>
                        )}
                    </div>
                    {isActive ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Active
                        </span>
                    ) : (
                        <Lock className="text-gray-400" size={20} />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="text-blue-600 dark:text-blue-400" size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {semester.subjects?.length || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Subjects</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                            <FileText className="text-purple-600 dark:text-purple-400" size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {semester.subjects?.reduce((total, subject) =>
                                    total + (subject.materials?.length || 0), 0) || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Materials</p>
                        </div>
                    </div>
                </div>

                {isActive ? (
                    <Link
                        href={`/${finalBasePath}/${code}/semester/${semester.id}`}
                        className="flex items-center justify-between w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 group-hover:shadow-lg no-underline"
                    >
                        <span>View Materials</span>
                        <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="flex items-center justify-between w-full px-5 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-medium cursor-not-allowed"
                    >
                        <span>Coming Soon</span>
                        <Lock size={18} />
                    </button>
                )}
            </div>

            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
        </div>
    );
};

export default SemesterCard;