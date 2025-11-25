"use client"

import React, { useContext, useState } from 'react';
import { BookOpen, FileText, ChevronRight, Lock, Power, PowerOff, Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { UserDetailContext } from '@/context/UserDetailContext';
import SemesterActions from '@/app/admin/library/_components/SemesterActions';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DownloadAllMaterialsButton from '@/components/DownloadAllMaterialsButton';

const SemesterCard = ({ basePath, semester, code, isAdmin, onUpdate, isSelected, onSelect, showDownloadInCard = false }) => {
    const router = useRouter();
    const { userDetail } = useContext(UserDetailContext);
    const [isToggling, setIsToggling] = useState(false);
    const isActive = semester.isActive;

    // Determine the correct base path based on user role
    const getBasePath = () => {
        if (basePath) return basePath;
        return userDetail?.role === 'admin' ? 'admin/library' : 'library';
    };

    const finalBasePath = getBasePath();
    console.log("SemesterCard - Final BasePath:", finalBasePath);

    const handleToggleActive = async (e) => {
        e.stopPropagation();
        try {
            setIsToggling(true);
            const response = await fetch('/api/admin/semesters/toggle-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    semesterId: semester.id,
                    isActive: !isActive
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(
                    isActive
                        ? `Semester "${semester.name}" deactivated successfully!`
                        : `Semester "${semester.name}" activated successfully!`
                );
                onUpdate();
            } else {
                toast.error(data.error || 'Failed to update semester status');
            }
        } catch (error) {
            console.error('Error toggling semester status:', error);
            toast.error('Failed to update semester status');
        } finally {
            setIsToggling(false);
        }
    };

    const handleCardClick = () => {
        if (isActive && !isAdmin) {
            // Clean semester name: remove spaces and convert to lowercase
            // "Semester 1" -> "semester-1"
            const cleanSemesterName = semester.name.toLowerCase().replace(/\s+/g, '-');
            router.push(`/${finalBasePath}/${code}/semester/${cleanSemesterName}`);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`
                group relative bg-white dark:bg-[rgb(24,24,24)] rounded-2xl p-6 
                border-2 transition-all duration-300 overflow-hidden
                ${isActive
                    ? 'border-blue-200 dark:border-blue-700 hover:shadow-2xl hover:-translate-y-1 cursor-pointer'
                    : 'border-gray-200 dark:border-gray-600 opacity-60'
                }
                ${isSelected ? 'ring-4 ring-blue-500/50 border-blue-500' : ''}
            `}
        >
            {/* Admin Checkbox - Top Left */}
            {isAdmin && onSelect && (
                <div
                    className="absolute top-4 left-4 z-20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onSelect}
                        className="h-5 w-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                </div>
            )}

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div className={isAdmin && onSelect ? 'pl-8' : ''}>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {semester.name}
                            </h3>
                        </div>
                        {semester.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {semester.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isActive ? (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                Active
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Inactive
                            </span>
                        )}
                    </div>
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

                <div className="flex items-center gap-2">
                    {isActive ? (
                        <div className="flex-1 flex flex-col gap-2">
                            <Link
                                href={`/${finalBasePath}/${code}/semester/${semester.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 group-hover:shadow-lg no-underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span>View Materials</span>
                                <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            {showDownloadInCard && (
                                <div onClick={(e) => e.stopPropagation()} className="w-full">
                                    <DownloadAllMaterialsButton
                                        category={code}
                                        semesterName={semester.name}
                                        variant="outline"
                                        size="default"
                                        className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            disabled
                            className="flex-1 flex items-center justify-between px-5 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-medium cursor-not-allowed"
                        >
                            <span>Coming Soon</span>
                            <Lock size={18} />
                        </button>
                    )}

                    {/* Admin Toggle Button */}
                    {isAdmin && (
                        <Button
                            onClick={handleToggleActive}
                            disabled={isToggling}
                            variant={isActive ? "outline" : "default"}
                            size="sm"
                            className={`flex-shrink-0 h-12 w-12 p-0 ${isActive
                                ? 'border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                            title={isActive ? "Deactivate Semester" : "Activate Semester"}
                        >
                            {isToggling ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isActive ? (
                                <PowerOff className="h-5 w-5 text-orange-600" />
                            ) : (
                                <Power className="h-5 w-5 text-white" />
                            )}
                        </Button>
                    )}

                    {/* Admin Actions Menu */}
                    {isAdmin && (
                        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <SemesterActions semester={semester} onUpdate={onUpdate} />
                        </div>
                    )}
                </div>
            </div>

            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
        </div>
    );
};

export default SemesterCard;