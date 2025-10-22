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
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Upload, ImageIcon, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

const FormCreateCourse = ({ onClose, onSuccess }) => {
    const [courseTitle, setCourseTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [uploading, setUploading] = useState(false)

    const categories = [
        { value: 'mca', label: 'MCA (Master of Computer Applications)' },
        { value: 'bca', label: 'BCA (Bachelor of Computer Applications)' },
        { value: 'btech', label: 'B.Tech (Bachelor of Technology)' },
        { value: 'mtech', label: 'M.Tech (Master of Technology)' },
        { value: 'bsc', label: 'B.Sc (Bachelor of Science)' },
        { value: 'msc', label: 'M.Sc (Master of Science)' }
    ]

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPG, PNG, or WebP)')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }

            setSelectedImage(file)

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview('')
    }

    const handleSubmit = async () => {
        // Validation
        if (!courseTitle.trim()) {
            toast.error('Please enter course title')
            return
        }

        if (!subtitle.trim()) {
            toast.error('Please enter course subtitle')
            return
        }

        if (!description.trim()) {
            toast.error('Please enter course description')
            return
        }

        if (!category) {
            toast.error('Please select a category')
            return
        }

        if (!selectedImage) {
            toast.error('Please upload a course image')
            return
        }

        setUploading(true)

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('image', selectedImage)
            formData.append('title', courseTitle.trim())
            formData.append('subtitle', subtitle.trim())
            formData.append('description', description.trim())
            formData.append('category', category)
            formData.append('fileName', selectedImage.name)
            formData.append('fileSize', selectedImage.size.toString())
            formData.append('fileType', selectedImage.type)

            // Upload to Supabase via API
            const response = await fetch('/api/admin/courses', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Course created successfully!')

                // Reset form
                setCourseTitle('')
                setSubtitle('')
                setDescription('')
                setCategory('')
                setSelectedImage(null)
                setImagePreview('')

                // Call onSuccess callback to refresh data
                onSuccess?.()

                // Close dialog
                onClose?.()
            } else {
                throw new Error(result.error || 'Course creation failed')
            }

        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error.message || 'Failed to create course')
        } finally {
            setUploading(false)
        }
    }

    return (
        <DialogContent className="bg-[#2a2a28] border-[#3a3a38] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl text-white">Create New Course</DialogTitle>
                <DialogDescription className="text-gray-400">
                    Add a new course with details and category
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="course-title" className="text-white">Course Title *</Label>
                    <Input
                        id="course-title"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="e.g., Data Structures and Algorithms"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subtitle" className="text-white">Subtitle *</Label>
                    <Input
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="e.g., Master the fundamentals of DSA"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a detailed description of the course..."
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[120px] resize-none"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Provide a comprehensive overview of what students will learn</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Course Code *</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value.toUpperCase())}
                        placeholder="e.g., MCA, BCA, BTECH"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Enter a unique course code (will be auto-converted to uppercase)</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image-upload" className="text-white">Course Image * (Max 5MB)</Label>
                    <div className="relative">
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={uploading}
                        />

                        {imagePreview ? (
                            <div className="relative w-full h-48 border-2 border-[#3a3a38] rounded-lg overflow-hidden bg-[#1a1a18]">
                                <img
                                    src={imagePreview}
                                    alt="Course preview"
                                    className="w-full h-full object-cover"
                                />
                                {!uploading && (
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                    >
                                        <X className="h-4 w-4 text-white" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <label
                                htmlFor="image-upload"
                                className={`flex items-center justify-center w-full h-48 border-2 border-dashed border-[#3a3a38] rounded-lg cursor-pointer hover:border-gray-500 transition-colors bg-[#1a1a18] ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                <div className="text-center">
                                    {uploading ? (
                                        <Loader2 className="mx-auto h-10 w-10 text-blue-400 mb-2 animate-spin" />
                                    ) : (
                                        <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                    )}
                                    <p className="text-sm text-gray-400">
                                        {uploading ? 'Uploading...' : 'Click to upload image'}
                                    </p>
                                    {!uploading && (
                                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or WebP (Max 5MB)</p>
                                    )}
                                </div>
                            </label>
                        )}
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
                        disabled={uploading || !courseTitle.trim() || !subtitle.trim() || !description.trim() || !category || !selectedImage}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Course'
                        )}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

export default FormCreateCourse