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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const FormCreateSubject = ({ onClose }) => {
    const [subjectName, setSubjectName] = useState('')
    const [subjectCode, setSubjectCode] = useState('')
    const [description, setDescription] = useState('')
    const [courseCategory, setCourseCategory] = useState('')
    const [uploading, setUploading] = useState(false)

    const categories = [
        { value: 'mca', label: 'MCA (Master of Computer Applications)' },
        { value: 'bca', label: 'BCA (Bachelor of Computer Applications)' },
        { value: 'btech', label: 'B.Tech (Bachelor of Technology)' },
        { value: 'mtech', label: 'M.Tech (Master of Technology)' },
        { value: 'bsc', label: 'B.Sc (Bachelor of Science)' },
        { value: 'msc', label: 'M.Sc (Master of Science)' }
    ]

    const handleSubmit = async () => {
        // Validation
        if (!subjectName.trim()) {
            toast.error('Please enter subject name')
            return
        }

        if (!subjectCode.trim()) {
            toast.error('Please enter subject code')
            return
        }

        if (!description.trim()) {
            toast.error('Please enter subject description')
            return
        }

        if (!courseCategory) {
            toast.error('Please select a course category')
            return
        }

        setUploading(true)

        try {
            // Create request body
            const requestBody = {
                name: subjectName.trim(),
                code: subjectCode.trim().toUpperCase(),
                description: description.trim(),
                courseCategory: courseCategory
            }

            // Submit to API
            const response = await fetch('/api/admin/subject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Subject created successfully!')

                // Reset form
                setSubjectName('')
                setSubjectCode('')
                setDescription('')
                setCourseCategory('')

                // Close dialog
                onClose?.()
            } else {
                throw new Error(result.error || 'Subject creation failed')
            }

        } catch (error) {
            console.error('Submit error:', error)
            toast.error(error.message || 'Failed to create subject')
        } finally {
            setUploading(false)
        }
    }

    return (
        <DialogContent className="bg-[#2a2a28] border-[#3a3a38] text-white max-w-xl">
            <DialogHeader>
                <DialogTitle className="text-2xl text-white">Create New Subject</DialogTitle>
                <DialogDescription className="text-gray-400">
                    Add a new subject with code, description and course category
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="subject-name" className="text-white">Subject Name *</Label>
                    <Input
                        id="subject-name"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        placeholder="e.g., Data Structures and Algorithms"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject-code" className="text-white">Subject Code *</Label>
                    <Input
                        id="subject-code"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        placeholder="e.g., CS101, MATH201, ENG101"
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500 uppercase"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Unique code to identify this subject</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter subject description and overview..."
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[120px] resize-none"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Provide details about what this subject covers</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="course-category" className="text-white">Course Category *</Label>
                    <Select value={courseCategory} onValueChange={setCourseCategory} disabled={uploading}>
                        <SelectTrigger className="bg-[#1a1a18] border-[#3a3a38] text-white focus:border-gray-500">
                            <SelectValue placeholder="Select course category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2a2a28] border-[#3a3a38] text-white">
                            {categories.map((cat) => (
                                <SelectItem
                                    key={cat.value}
                                    value={cat.value}
                                    className="focus:bg-[#3a3a38] focus:text-white"
                                >
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Select which course this subject belongs to</p>
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
                        disabled={uploading || !subjectName.trim() || !subjectCode.trim() || !description.trim() || !courseCategory}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Subject'
                        )}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

export default FormCreateSubject