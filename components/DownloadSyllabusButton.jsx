"use client"

import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DownloadSyllabusButton = ({ semesterId, semesterName, variant = "outline", size = "sm", className = "" }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async (e) => {
        e.stopPropagation();

        if (!semesterId) {
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
                body: JSON.stringify({ semesterId })
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
                window.open(data.syllabi[0].syllabusUrl, '_blank');
                return;
            }

            // Multiple syllabi - download as ZIP
            const downloadToastId = toast.loading(`Downloading ${data.syllabi.length} syllabus files...`);
            const zip = new JSZip();

            // Download all syllabi
            for (let i = 0; i < data.syllabi.length; i++) {
                const syllabus = data.syllabi[i];
                try {
                    const fileResponse = await fetch(syllabus.syllabusUrl);
                    const blob = await fileResponse.blob();

                    // Add to ZIP with subject code and name
                    const fileName = `${syllabus.subjectCode}_${syllabus.subjectName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
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
        <Button
            onClick={handleDownload}
            disabled={downloading}
            variant={variant}
            size={size}
            className={`gap-2 ${className}`}
            title="Download All Syllabus"
        >
            {downloading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    <FileDown className="h-4 w-4" />
                    Download Syllabus
                </>
            )}
        </Button>
    );
};

export default DownloadSyllabusButton;
