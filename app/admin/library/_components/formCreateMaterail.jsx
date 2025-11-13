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

const FormCreateMaterial = ({ onClose, onSuccess, prefilledSubjectCode }) => {
    const [fileName, setFileName] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [courseCode, setCourseCode] = useState(prefilledSubjectCode || '')
    const [docTitle, setDocTitle] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

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
        setUploadProgress(0)

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('courseCode', courseCode.trim()) // This will be treated as subjectCode in API
            formData.append('title', docTitle.trim())
            formData.append('fileName', selectedFile.name)
            formData.append('fileSize', selectedFile.size.toString())
            formData.append('fileType', selectedFile.type)

            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest()

            // Progress handler
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100)
                    setUploadProgress(percentComplete)
                }
            })

            // Upload promise
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const result = JSON.parse(xhr.responseText)
                            resolve(result)
                        } catch (error) {
                            reject(new Error('Invalid response format'))
                        }
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`))
                    }
                })

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'))
                })

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload cancelled'))
                })

                xhr.open('POST', '/api/admin/upload')
                xhr.send(formData)
            })

            const result = await uploadPromise

            if (result.success) {
                setUploadProgress(100)
                toast.success('Material uploaded successfully!')

                // Reset form (only if not prefilled)
                if (!prefilledSubjectCode) {
                    setCourseCode('')
                }
                setDocTitle('')
                setFileName('')
                setSelectedFile(null)

                // Call success callback
                onSuccess?.()

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
            setUploadProgress(0)
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
                    <Label htmlFor="course-code" className="text-white">
                        Subject Code * {prefilledSubjectCode && <span className="text-gray-500 text-xs">(Auto-filled)</span>}
                    </Label>
                    <Input
                        id="course-code"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                        placeholder="e.g., CS101, MATH201"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading || !!prefilledSubjectCode}
                        readOnly={!!prefilledSubjectCode}
                    />
                    <p className="text-xs text-gray-500">
                        {prefilledSubjectCode
                            ? `Material will be uploaded to ${prefilledSubjectCode}`
                            : 'Enter the subject code for which you want to upload material'}
                    </p>
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
                            <div className="text-center w-full px-4">
                                {uploading ? (
                                    <>
                                        <Loader2 className="mx-auto h-10 w-10 text-blue-400 mb-2 animate-spin" />
                                        <div className="w-full max-w-xs mx-auto mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-400">Uploading...</span>
                                                <span className="text-sm font-bold text-blue-400">{uploadProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                )}

                                {fileName && !uploading ? (
                                    <div className="flex items-center justify-center gap-2 text-white">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">{fileName}</span>
                                    </div>
                                ) : !uploading && (
                                    <>
                                        <p className="text-sm text-gray-400">
                                            Click to upload PDF
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
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