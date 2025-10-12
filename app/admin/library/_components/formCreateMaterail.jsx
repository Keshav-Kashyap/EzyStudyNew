"use client"

import React, { useState } from 'react'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const FormCreateMaterial = ({ onClose }) => {
    const [fileName, setFileName] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [courseCode, setCourseCode] = useState('')
    const [docTitle, setDocTitle] = useState('')
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                toast.error('Please select a PDF file only')
                return
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB')
                return
            }

            setFileName(file.name)
            setSelectedFile(file)
        }
    }

    const handleSubmit = async () => {
        // Validation
        if (!courseCode.trim()) {
            toast.error('Please enter subject code')
            return
        }

        if (!docTitle.trim()) {
            toast.error('Please enter document title')
            return
        }

        if (!selectedFile) {
            toast.error('Please select a PDF file')
            return
        }

        setUploading(true)

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('courseCode', courseCode.trim()) // This will be treated as subjectCode in API
            formData.append('title', docTitle.trim())
            formData.append('fileName', selectedFile.name)
            formData.append('fileSize', selectedFile.size.toString())
            formData.append('fileType', selectedFile.type)

            // Upload to Supabase via API
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Material uploaded successfully!')

                // Reset form
                setCourseCode('')
                setDocTitle('')
                setFileName('')
                setSelectedFile(null)

                // Close dialog
                onClose?.()
            } else {
                throw new Error(result.error || 'Upload failed')
            }

        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error.message || 'Failed to upload material')
        } finally {
            setUploading(false)
        }
    }

    return (
        <DialogContent className="bg-[#2a2a28] border-[#3a3a38] text-white max-w-xl">
            <DialogHeader>
                <DialogTitle className="text-2xl text-white">Upload Material</DialogTitle>
                <DialogDescription className="text-gray-400">
                    Add course materials and documents to Supabase storage
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="course-code" className="text-white">Subject Code *</Label>
                    <Input
                        id="course-code"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        placeholder="e.g., CS101, MATH201, ENG101"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Enter the subject code for which you want to upload material</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="doc-title" className="text-white">Document Title *</Label>
                    <Input
                        id="doc-title"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        placeholder="e.g., Lecture Notes - Chapter 5"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pdf-upload" className="text-white">Upload PDF * (Max 10MB)</Label>
                    <div className="relative">
                        <Input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="pdf-upload"
                            className={`flex items-center justify-center w-full h-32 border-2 border-dashed border-[#3a3a38] rounded-lg cursor-pointer hover:border-gray-500 transition-colors bg-[#1a1a18] ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <div className="text-center">
                                {uploading ? (
                                    <Loader2 className="mx-auto h-10 w-10 text-blue-400 mb-2 animate-spin" />
                                ) : (
                                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                )}

                                {fileName ? (
                                    <div className="flex items-center justify-center gap-2 text-white">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">{fileName}</span>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-400">
                                            {uploading ? 'Uploading...' : 'Click to upload PDF'}
                                        </p>
                                        {!uploading && (
                                            <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={onClose}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={uploading || !selectedFile || !courseCode.trim() || !docTitle.trim()}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Material'
                        )}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

export default FormCreateMaterial