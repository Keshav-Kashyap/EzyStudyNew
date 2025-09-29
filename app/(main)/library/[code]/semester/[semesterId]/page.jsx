"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';

const SemesterDetail = () => {
    const { code, semesterId } = useParams();
    const router = useRouter();
    const [semesterData, setSemesterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch semester data from API
    useEffect(() => {
        const fetchSemesterData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/courses/${code}/semester/${semesterId}`);
                const data = await response.json();

                if (data.success) {
                    setSemesterData(data.semester);
                } else {
                    throw new Error(data.error || 'Failed to fetch semester data');
                }
            } catch (err) {
                console.error('Error fetching semester data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (code && semesterId) {
            fetchSemesterData();
        }
    }, [code, semesterId]);

    const handleDownload = (material) => {
        // In a real app, you'd track downloads and update the counter
        console.log('Downloading:', material.title);
        if (material.fileUrl) {
            window.open(material.fileUrl, '_blank');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">Loading semester materials...</p>
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Semester</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            Try Again
                        </button>
                        <Link
                            href={`/library/${code}`}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                        >
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href={`/library/${code}`}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {semesterData?.name || `Semester ${semesterId}`}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {code.toUpperCase()} • {semesterData?.subjects?.length || 0} Subjects • {semesterData?.stats?.totalMaterials || 0} Materials
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {semesterData?.description && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <p className="text-gray-600 dark:text-gray-300">{semesterData.description}</p>
                        </div>
                    )}
                </div>

                {/* Subjects */}
                <div className="space-y-8">
                    {semesterData?.subjects?.map((subject) => (
                        <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                            {/* Subject Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                            {subject.name}
                                        </h2>
                                        {subject.code && (
                                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                                                {subject.code}
                                            </span>
                                        )}
                                        {subject.description && (
                                            <p className="text-gray-600 dark:text-gray-300 mt-2">{subject.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {subject.materials?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Materials</div>
                                    </div>
                                </div>
                            </div>

                            {/* Materials */}
                            <div className="p-6">
                                {subject.materials && subject.materials.length > 0 ? (
                                    <div className="grid gap-4">
                                        {subject.materials.map((material) => (
                                            <div
                                                key={material.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {material.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                            <span>{material.type || 'PDF'}</span>
                                                            <span>•</span>
                                                            <span>{material.size || '2.5 MB'}</span>
                                                            <span>•</span>
                                                            <span>{material.downloadCount || 0} downloads</span>
                                                        </div>
                                                        {material.description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                                {material.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDownload(material)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Download
                                                    </button>
                                                    {material.fileUrl && (
                                                        <button
                                                            onClick={() => window.open(material.fileUrl, '_blank')}
                                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            No materials available
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Study materials for this subject will be uploaded soon.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
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

export default SemesterDetail;