"use client"
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import SubjectCard from './SubjectCard'


const SemesterDetail = ({ basePath }) => {

    console.log("base path:", basePath);

    const { code, semesterId } = useParams();
    const [semesterData, setSemesterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        console.log('Downloading:', material.title);
        if (material.fileUrl) {
            window.open(material.fileUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <Link
                        href={`/library/${code}`}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-block"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href={`/library/${code}`}
                            className="p-2 rounded-lg bg-white dark:bg-[rgb(24,24,24)] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {semesterData?.name || `Semester ${semesterId}`}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {code.toUpperCase()} • {semesterData?.subjects?.length || 0} Subjects
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {semesterData?.subjects?.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            base={basePath || 'library'}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SemesterDetail;