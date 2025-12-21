"use client"

import React, { useState, useEffect } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ReviewPromptModal from '@/components/ReviewPromptModal';

const DownloadSyllabusButton = ({ category, semesterName, variant = "outline", size = "sm", className = "" }) => {
    const [downloading, setDownloading] = useState(false);
    const [hasSyllabus, setHasSyllabus] = useState(false);
    const [checking, setChecking] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [pendingDownload, setPendingDownload] = useState(false);

    // Check if syllabus exists on mount
    useEffect(() => {
        checkSyllabusAvailability();
        checkReviewStatus();
    }, [category, semesterName]);

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

    const checkSyllabusAvailability = async () => {
        if (!category || !semesterName) {
            setHasSyllabus(false);
            setChecking(false);
            return;
        }

        try {
            const response = await fetch('/api/download/semester-syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, semesterName })
            });

            const data = await response.json();
            setHasSyllabus(data.success && data.syllabi && data.syllabi.length > 0);
        } catch (error) {
            setHasSyllabus(false);
        } finally {
            setChecking(false);
        }
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();

        if (!hasReviewed) {
            setPendingDownload(true);
            setShowReviewModal(true);
        } else {
            handleDownload(e);
        }
    };

    const handleReviewSubmitted = async () => {
        // Update local state immediately
        setHasReviewed(true);
        setShowReviewModal(false);
        
        // Execute the pending download
        if (pendingDownload) {
            setPendingDownload(false);
            // Small delay to ensure modal is fully closed
            setTimeout(() => {
                const syntheticEvent = { stopPropagation: () => {} };
                handleDownload(syntheticEvent);
            }, 100);
        }
    };

    const handleDownload = async (e) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        if (!category || !semesterName) {
            toast.error('Semester information not available');
            return;
        }

        setDownloading(true);
        const toastId = toast.loading('Fetching syllabi...');

        try {
            // Call API to get all syllabi for the semester
            const response = await fetch('/api/download/semester-syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, semesterName })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch syllabi');
            }

            const data = await response.json();

            if (!data.success || !data.syllabi || data.syllabi.length === 0) {
                toast.error(data.error || 'No syllabus available for this semester', { id: toastId });
                return;
            }

            toast.success(`Found ${data.syllabi.length} syllabus files`, { id: toastId });

            // If only one syllabus, open directly
            if (data.syllabi.length === 1) {
                window.open(data.syllabi[0].fileUrl, '_blank');
                return;
            }

            // Multiple syllabi - download as ZIP
            const downloadToastId = toast.loading(`Downloading ${data.syllabi.length} syllabus files...`);
            const zip = new JSZip();

            // Download all syllabi
            for (let i = 0; i < data.syllabi.length; i++) {
                const syllabus = data.syllabi[i];
                try {
                    // Convert Google Drive preview URLs to download URLs
                    let downloadUrl = syllabus.fileUrl
                    if (downloadUrl.includes('drive.google.com/file/d/') && downloadUrl.includes('/preview')) {
                        const fileIdMatch = downloadUrl.match(/\/file\/d\/([^\/]+)/)
                        if (fileIdMatch) {
                            downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}&confirm=t`
                        }
                    }

                    const fileResponse = await fetch(downloadUrl, { mode: 'cors' });
                    const blob = await fileResponse.blob();

                    // Add to ZIP with subject code and name
                    const fileName = `${syllabus.code}_${syllabus.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                    zip.file(fileName, blob);
                } catch (error) {
                    console.error(`Failed to download syllabus for ${syllabus.subjectName}:`, error);
                }
            }

            // Generate ZIP and download
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipFileName = `${semesterName.replace(/\s+/g, '-')}_Syllabi.zip`;
            saveAs(zipBlob, zipFileName);

            toast.success('All syllabi downloaded successfully!', { id: downloadToastId });

        } catch (error) {
            console.error('Error downloading syllabi:', error);
            toast.error('Failed to download syllabi', { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleDownloadClick}
                disabled={downloading || checking || !hasSyllabus}
                variant={variant}
                size={size}
                className={`gap-2 ${className}`}
                title={!hasSyllabus ? "No syllabus available" : "Download All Syllabus"}
            >
                {checking ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking...
                    </>
                ) : downloading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        <FileDown className="h-4 w-4" />
                        {hasSyllabus ? 'Download Syllabus' : 'No Syllabus'}
                    </>
                )}
            </Button>

            {/* Review Prompt Modal */}
            <ReviewPromptModal
                isOpen={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false);
                    setPendingDownload(false);
                }}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </>
    );
};

export default DownloadSyllabusButton;
