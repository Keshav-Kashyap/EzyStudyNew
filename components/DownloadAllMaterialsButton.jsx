"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, FolderArchive } from 'lucide-react'
import { toast } from 'sonner'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const DownloadAllMaterialsButton = ({ category, semesterName, variant = "outline", size = "sm", className = "" }) => {
    const [downloading, setDownloading] = useState(false)
    const [progress, setProgress] = useState(0)

    const downloadAllMaterials = async () => {
        setDownloading(true)
        setProgress(0)

        try {
            // Fetch all materials metadata
            const response = await fetch('/api/download/semester-materials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, semesterName })
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch materials')
            }

            const { materialsBySubject, semester, totalMaterials } = result.data

            if (totalMaterials === 0) {
                toast.info('No materials found for this semester')
                setDownloading(false)
                return
            }

            toast.loading(`Preparing ${totalMaterials} files...`, { id: 'download-prep' })

            // Create ZIP
            const zip = new JSZip()
            const semesterFolder = zip.folder(semester.replace(/[/\\?%*:|"<>]/g, '-'))

            let downloadedCount = 0

            // Download and add files to ZIP by subject
            for (const [subjectName, materials] of Object.entries(materialsBySubject)) {
                const subjectFolder = semesterFolder.folder(subjectName.replace(/[/\\?%*:|"<>]/g, '-'))

                for (const material of materials) {
                    try {
                        // Convert Google Drive preview URLs to download URLs
                        let downloadUrl = material.url

                        // Check if it's a Google Drive link
                        const isGoogleDrive = downloadUrl.includes('drive.google.com')

                        if (isGoogleDrive) {
                            // Use proxy to bypass CORS
                            const proxyResponse = await fetch('/api/download/proxy', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ url: downloadUrl })
                            })

                            if (!proxyResponse.ok) {
                                console.warn(`Failed to download: ${material.title}`)
                                continue
                            }

                            const blob = await proxyResponse.blob()

                            // Ensure it's treated as PDF
                            const pdfBlob = new Blob([blob], { type: 'application/pdf' })

                            // Clean filename
                            const fileName = `${material.title.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`

                            // Add to ZIP
                            subjectFolder.file(fileName, pdfBlob)
                        } else {
                            // Direct download for Supabase or other URLs
                            const fileResponse = await fetch(downloadUrl)

                            if (!fileResponse.ok) {
                                console.warn(`Failed to download: ${material.title}`)
                                continue
                            }

                            const blob = await fileResponse.blob()

                            // Ensure it's treated as PDF
                            const pdfBlob = new Blob([blob], { type: 'application/pdf' })

                            // Clean filename
                            const fileName = `${material.title.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`

                            // Add to ZIP
                            subjectFolder.file(fileName, pdfBlob)
                        }

                        downloadedCount++
                        setProgress(Math.round((downloadedCount / totalMaterials) * 100))

                        toast.loading(`Downloading ${downloadedCount}/${totalMaterials} files...`, { id: 'download-prep' })
                    } catch (error) {
                        console.error(`Error downloading ${material.title}:`, error)
                    }
                }
            }

            toast.dismiss('download-prep')

            if (downloadedCount === 0) {
                throw new Error('Failed to download any files')
            }

            toast.loading('Creating ZIP file...', { id: 'zip-create' })

            // Generate ZIP
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            })

            toast.dismiss('zip-create')

            // Download ZIP
            const zipFileName = `${semester.replace(/[/\\?%*:|"<>]/g, '-')}_Materials.zip`
            saveAs(zipBlob, zipFileName)

            toast.success(`✅ Downloaded ${downloadedCount} files!`, {
                description: `${semester} materials saved as ${zipFileName}`
            })

        } catch (error) {
            console.error('Download error:', error)
            toast.error('Failed to download materials', {
                description: error.message
            })
        } finally {
            setDownloading(false)
            setProgress(0)
            toast.dismiss('download-prep')
            toast.dismiss('zip-create')
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={downloadAllMaterials}
            disabled={downloading}
            className={`gap-2 ${className}`}
        >
            {downloading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {progress > 0 ? `${progress}%` : 'Preparing...'}
                </>
            ) : (
                <>
                    <FolderArchive className="h-4 w-4" />
                    Download All
                </>
            )}
        </Button>
    )
}

export default DownloadAllMaterialsButton
