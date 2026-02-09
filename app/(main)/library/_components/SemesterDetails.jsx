"use client"
import React, { useContext, useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Calendar, ArrowLeft, ExternalLink, Loader2, Upload } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import SubjectCard from './SubjectCard'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSemesterDetail, useInvalidateSemesterDetail } from '@/hooks/useCourses';
import DownloadAllMaterialsButton from '@/components/DownloadAllMaterialsButton';
import DownloadSyllabusButton from '@/components/DownloadSyllabusButton';
import ReviewPromptModal from '@/components/ReviewPromptModal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import FormUploadSyllabus from '@/app/admin/library/_components/FormUploadSyllabus';
import { Button } from '@/components/ui/button';
import GPTSidebar from '@/components/GPTSidebar';


const SemesterDetail = ({ basePath }) => {
    const { userDetail } = useContext(UserDetailContext);
    const isAdmin = userDetail?.role === "admin";
    const [syllabusDialogOpen, setSyllabusDialogOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [pendingDownload, setPendingDownload] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);

    // AI Sidebar state
    const [aiSidebarOpen, setAISidebarOpen] = useState(false);
    const [aiMessages, setAIMessages] = useState([]);
    const [aiContext, setAIContext] = useState('syllabus');

    const { code, semesterId } = useParams();

    // Convert URL format back to database format
    // "semester-1" -> "Semester 1"
    const semesterName = semesterId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const { data: semesterData, isLoading, isError, error } = useSemesterDetail(code, semesterName);
    const invalidateSemester = useInvalidateSemesterDetail(code, semesterName);

    // Dummy GPT handler (replace with real API call)
    const handleAISend = async (input) => {
        setAIMessages((msgs) => [...msgs, { role: 'user', content: input, context: aiContext }]);
        // Simulate AI response
        setTimeout(() => {
            setAIMessages((msgs) => [
                ...msgs,
                { role: 'assistant', content: `AI response for: "${input}" (Context: ${aiContext})` }
            ]);
        }, 800);
    };

    const handleUpdate = async () => {
        // Show refreshing state
        setRefreshing(true);

        // Refetch the data after update/delete
        await invalidateSemester();

        // Small delay to show loading state
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    };

    // Check if user has reviewed on component mount
    useEffect(() => {
        checkReviewStatus();
    }, []);

    const checkReviewStatus = async () => {
        try {
            const response = await fetch('/api/check-review-status');
            const data = await response.json();
            if (data.success) {
                setHasReviewed(data.hasReviewed);
            }
        } catch (error) {
            console.error('Error checking review status:', error);
        }
    };

    const handleDownload = (material) => {
        // Admin can download without review
        if (isAdmin) {
            if (material.fileUrl) {
                window.open(material.fileUrl, '_blank');
            }
            return;
        }

        // Check if user has reviewed
        if (!hasReviewed) {
            setPendingDownload(material);
            setShowReviewModal(true);
        } else {
            if (material.fileUrl) {
                window.open(material.fileUrl, '_blank');
            }
        }
    };

    const handleReviewSubmitted = async () => {
        // Update local state immediately
        setHasReviewed(true);
        setShowReviewModal(false);

        // Execute the pending download
        if (pendingDownload && pendingDownload.fileUrl) {
            // Small delay to ensure modal is fully closed
            setTimeout(() => {
                window.open(pendingDownload.fileUrl, '_blank');
                setPendingDownload(null);
            }, 100);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error?.message}</p>
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
        <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] relative flex">
            {/* Main Content */}
            <div className={`flex-1 p-3 sm:p-6 transition-all duration-300 ${aiSidebarOpen ? 'sm:mr-[500px]' : ''}`}>
                <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Link
                                href={`/library/${code}`}
                                className="p-2 rounded-lg bg-white dark:bg-[rgb(24,24,24)] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 flex-shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                    {semesterData?.name || semesterName}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {code.toUpperCase()} • {semesterData?.subjects?.length || 0} Subjects
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {/* Learn with AI button */}
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 shadow"
                                onClick={() => setAISidebarOpen(true)}
                            >
                                Learn with AI
                            </Button>
                            {isAdmin && (
                                <Dialog open={syllabusDialogOpen} onOpenChange={setSyllabusDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                                        >
                                            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                            Upload Syllabus
                                        </Button>
                                    </DialogTrigger>
                                    <FormUploadSyllabus
                                        onClose={() => setSyllabusDialogOpen(false)}
                                        onSuccess={() => {
                                            invalidateSemester();
                                            setSyllabusDialogOpen(false);
                                        }}
                                        prefilledCategory={code}
                                        prefilledSemester={semesterName}
                                    />
                                </Dialog>
                            )}
                            <DownloadAllMaterialsButton
                                category={code}
                                semesterName={semesterName}
                                variant="default"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                            />
                            <DownloadSyllabusButton
                                category={code}
                                semesterName={semesterName}
                                variant="default"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {/* Loading overlay */}
                    {refreshing && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300">Refreshing...</p>
                            </div>
                        </div>
                    )}

                    {semesterData?.subjects?.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            base={basePath || 'library'}
                            onDownload={handleDownload}
                            isAdmin={isAdmin}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>

                {/* Review Prompt Modal */}
                <ReviewPromptModal
                    isOpen={showReviewModal}
                    onClose={() => {
                        setShowReviewModal(false);
                        setPendingDownload(null);
                    }}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            </div>

            {/* AI Sidebar */}
            {aiSidebarOpen && (
                <GPTSidebar
                    open={aiSidebarOpen}
                    onClose={() => setAISidebarOpen(false)}
                    onSend={handleAISend}
                    messages={aiMessages}
                    context={aiContext}
                    setContext={setAIContext}
                />
            )}
        </div>
    );
};

export default SemesterDetail;