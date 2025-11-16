"use client"

import React, { useState, useEffect } from 'react'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, Loader2, Check, X, Link2 } from 'lucide-react'
import { toast } from 'sonner'

const FormCreateMaterial = ({ onClose, onSuccess, prefilledSubjectCode }) => {
    const [fileName, setFileName] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [courseCode, setCourseCode] = useState(prefilledSubjectCode || '')
    const [docTitle, setDocTitle] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadMode, setUploadMode] = useState('file') // 'file' or 'link'
    const [fileUrl, setFileUrl] = useState('')
    const [materialType, setMaterialType] = useState('PDF') // 'PDF' or 'SYLLABUS'
    const [isPopular, setIsPopular] = useState(false)

    // Multi-select state
    const [allSubjects, setAllSubjects] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [loadingSubjects, setLoadingSubjects] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch all subjects on mount
    useEffect(() => {
        fetchAllSubjects()
    }, [])

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.subject-dropdown-container')) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const fetchAllSubjects = async () => {
        setLoadingSubjects(true)
        try {
            const response = await fetch('/api/admin/subjects/all')
            const result = await response.json()

            if (result.success) {
                const subjects = Array.isArray(result.subjects) ? result.subjects : []
                setAllSubjects(subjects)

                // Auto-select if prefilled subject code
                if (prefilledSubjectCode && subjects.length > 0) {
                    const matchingSubject = subjects.find(
                        s => s && s.code && s.code.toUpperCase() === prefilledSubjectCode.toUpperCase()
                    )
                    if (matchingSubject) {
                        setSelectedSubjects([matchingSubject])
                    }
                }
            } else {
                toast.error(result.error || 'Failed to load subjects')
                setAllSubjects([])
            }
        } catch (error) {
            console.error('Error fetching subjects:', error)
            toast.error('Failed to load subjects')
            setAllSubjects([])
        } finally {
            setLoadingSubjects(false)
        }
    }

    const toggleSubjectSelection = (subject) => {
        setSelectedSubjects(prev => {
            const exists = prev.find(s => s.id === subject.id)
            if (exists) {
                return prev.filter(s => s.id !== subject.id)
            } else {
                return [...prev, subject]
            }
        })
    }

    const removeSubject = (subjectId) => {
        setSelectedSubjects(prev => prev.filter(s => s.id !== subjectId))
    }

    const filteredSubjects = allSubjects.filter(subject => {
        const search = searchTerm.toLowerCase()
        return (
            subject.name.toLowerCase().includes(search) ||
            subject.code.toLowerCase().includes(search) ||
            subject.category.toLowerCase().includes(search) ||
            subject.semesterName.toLowerCase().includes(search)
        )
    })

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                toast.error('Please select a PDF file only')
                return
            }

            // No file size limit for admin - they can upload any size
            setFileName(file.name)
            setSelectedFile(file)
            toast.success(`Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`)
        }
    }

    const handleSubmit = async () => {
        // Validation
        if (!docTitle.trim()) {
            toast.error('Please enter document title')
            return
        }

        if (uploadMode === 'file' && !selectedFile) {
            toast.error('Please select a PDF file')
            return
        }

        if (uploadMode === 'link' && !fileUrl.trim()) {
            toast.error('Please enter a valid PDF link')
            return
        }

        if (selectedSubjects.length === 0) {
            toast.error('Please select at least one subject')
            return
        }

        setUploading(true)
        setUploadProgress(0)

        try {
            if (uploadMode === 'link') {
                // Handle link-based upload
                const response = await fetch('/api/admin/upload-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: docTitle.trim(),
                        fileUrl: fileUrl.trim(),
                        subjectIds: selectedSubjects.map(s => s.id),
                        courseCode: selectedSubjects[0]?.code || '',
                        type: materialType,
                        isPopular: isPopular
                    })
                })

                const result = await response.json()

                if (result.success) {
                    setUploadProgress(100)
                    toast.success(`Material added to ${selectedSubjects.length} subject(s)!`)

                    // Reset form
                    setDocTitle('')
                    setFileUrl('')
                    setSelectedFile(null)
                    setFileName('')
                    if (!prefilledSubjectCode) {
                        setSelectedSubjects([])
                        setCourseCode('')
                    }

                    // Refresh data and close
                    if (onSuccess) {
                        await onSuccess()
                    }
                    if (onClose) {
                        onClose()
                    }
                } else {
                    throw new Error(result.error || 'Failed to add material')
                }
            } else {
                // Handle file upload with progress
                const formData = new FormData()
                formData.append('file', selectedFile)
                formData.append('title', docTitle.trim())
                formData.append('fileName', selectedFile.name)
                formData.append('fileSize', selectedFile.size.toString())
                formData.append('fileType', selectedFile.type)
                formData.append('type', materialType)
                formData.append('isPopular', isPopular.toString())
                formData.append('subjectIds', JSON.stringify(selectedSubjects.map(s => s.id)))

                if (selectedSubjects.length > 0) {
                    formData.append('courseCode', selectedSubjects[0].code)
                }

                const xhr = new XMLHttpRequest()

                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100)
                        setUploadProgress(percentComplete)
                    }
                })

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
                    toast.success(`Material uploaded and assigned to ${selectedSubjects.length} subject(s)!`)

                    // Reset form
                    setDocTitle('')
                    setFileName('')
                    setSelectedFile(null)
                    if (!prefilledSubjectCode) {
                        setSelectedSubjects([])
                        setCourseCode('')
                    }

                    // Refresh data and close
                    if (onSuccess) {
                        await onSuccess()
                    }
                    if (onClose) {
                        onClose()
                    }
                } else {
                    throw new Error(result.error || 'Upload failed')
                }
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
                {/* Subject Multi-Select */}
                <div className="space-y-2">
                    <Label className="text-white">
                        Select Subjects *
                        {prefilledSubjectCode && <span className="text-gray-500 text-xs ml-2">(Pre-selected)</span>}
                    </Label>

                    {/* Selected Subjects Display */}
                    {selectedSubjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-[#1a1a18] border border-[#3a3a38] rounded-lg">
                            {selectedSubjects.map(subject => (
                                <div
                                    key={subject.id}
                                    className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-sm"
                                >
                                    <span>{subject.code} - {subject.name}</span>
                                    {!prefilledSubjectCode && (
                                        <button
                                            onClick={() => removeSubject(subject.id)}
                                            className="hover:bg-blue-700 rounded"
                                            disabled={uploading}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Subject Search & Dropdown */}
                    {!prefilledSubjectCode && (
                        <div className="relative subject-dropdown-container">
                            <Input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setShowDropdown(true)
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Search subjects by name, code, course..."
                                className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500"
                                disabled={uploading || loadingSubjects}
                            />

                            {/* Dropdown */}
                            {showDropdown && filteredSubjects.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-[#1a1a18] border border-[#3a3a38] rounded-lg shadow-lg">
                                    {filteredSubjects.map(subject => {
                                        const isSelected = selectedSubjects.find(s => s.id === subject.id)
                                        return (
                                            <div
                                                key={subject.id}
                                                onClick={() => toggleSubjectSelection(subject)}
                                                className="flex items-center justify-between px-3 py-2 hover:bg-[#2a2a28] cursor-pointer border-b border-[#3a3a38] last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <div className="text-white text-sm font-medium">
                                                        {subject.code} - {subject.name}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {subject.category} • {subject.semesterName}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <Check className="h-4 w-4 text-blue-500" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-gray-500">
                        {selectedSubjects.length === 0
                            ? 'Search and select subjects where this material will be available'
                            : `Selected ${selectedSubjects.length} subject(s). Material will appear in all selected subjects.`
                        }
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

                {/* Popular Status Checkbox */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is-popular"
                            checked={isPopular}
                            onChange={(e) => setIsPopular(e.target.checked)}
                            disabled={uploading}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <Label htmlFor="is-popular" className="text-white cursor-pointer">
                            Mark as Popular Note
                        </Label>
                    </div>
                    <p className="text-xs text-gray-500">
                        Popular notes will appear in the Popular Notes section and homepage
                    </p>
                </div>

                {/* Material Type Selection */}
                <div className="space-y-2">
                    <Label className="text-white">Material Type *</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="PDF"
                                checked={materialType === 'PDF'}
                                onChange={(e) => setMaterialType(e.target.value)}
                                disabled={uploading}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-white text-sm">Study Material</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="SYLLABUS"
                                checked={materialType === 'SYLLABUS'}
                                onChange={(e) => setMaterialType(e.target.value)}
                                disabled={uploading}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-white text-sm">Syllabus</span>
                        </label>
                    </div>
                    <p className="text-xs text-gray-500">
                        {materialType === 'PDF' ? 'Regular study materials like notes, books, etc.' : 'Course syllabus documents'}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="pdf-upload" className="text-white">
                            {uploadMode === 'file' ? 'Upload PDF * (No Size Limit)' : 'PDF Link *'}
                        </Label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setUploadMode(uploadMode === 'file' ? 'link' : 'file')
                                setSelectedFile(null)
                                setFileName('')
                                setFileUrl('')
                            }}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                            disabled={uploading}
                        >
                            {uploadMode === 'file' ? (
                                <>
                                    <Link2 className="h-4 w-4 mr-1" />
                                    Upload via Link
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload File
                                </>
                            )}
                        </Button>
                    </div>

                    {uploadMode === 'link' ? (
                        <div className="space-y-2">
                            <Input
                                value={fileUrl}
                                onChange={(e) => setFileUrl(e.target.value)}
                                placeholder="https://example.com/document.pdf or Google Drive link"
                                className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                                disabled={uploading}
                            />
                            <p className="text-xs text-gray-500">
                                Paste a direct link to PDF file. Google Drive links will be auto-converted.
                            </p>
                        </div>
                    ) : (
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
                    )}
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
                        disabled={uploading || (uploadMode === 'file' ? !selectedFile : !fileUrl.trim()) || selectedSubjects.length === 0 || !docTitle.trim()}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {uploadMode === 'link' ? 'Adding...' : 'Uploading...'}
                            </>
                        ) : (
                            `${uploadMode === 'link' ? 'Add' : 'Upload'} to ${selectedSubjects.length} Subject(s)`
                        )}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

export default FormCreateMaterial