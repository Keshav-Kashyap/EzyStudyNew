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

const FormCreateSemester = ({ onClose }) => {
    const [semesterName, setSemesterName] = useState('')
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
        if (!semesterName.trim()) {
            toast.error('Please enter semester name')
            return
        }

        if (!description.trim()) {
            toast.error('Please enter semester description')
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
                name: semesterName.trim(),
                description: description.trim(),
                courseCategory: courseCategory
            }

            // Submit to API
            const response = await fetch('/api/admin/semester', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Semester created successfully!')

                // Reset form
                setSemesterName('')
                setDescription('')
                setCourseCategory('')

                // Close dialog
                onClose?.()
            } else {
                throw new Error(result.error || 'Semester creation failed')
            }

        } catch (error) {
            console.error('Submit error:', error)
            toast.error(error.message || 'Failed to create semester')
        } finally {
            setUploading(false)
        }
    }

    return (
        <DialogContent className="bg-[#2a2a28] border-[#3a3a38] text-white max-w-xl">
            <DialogHeader>
                <DialogTitle className="text-2xl text-white">Create New Semester</DialogTitle>
                <DialogDescription className="text-gray-400">
                    Add a new semester with description and course category
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="semester-name" className="text-white">Semester Name *</Label>
                    <Input
                        id="semester-name"
                        value={semesterName}
                        onChange={(e) => setSemesterName(e.target.value)}
                        placeholder="e.g., Semester 1, First Semester, Sem I"
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
                        placeholder="Enter semester description and overview..."
                        className="bg-[#1a1a18] border-[#3a3a38] text-white placeholder:text-gray-500 focus:border-gray-500 min-h-[120px] resize-none"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Provide details about what this semester covers</p>
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
                    <p className="text-xs text-gray-500">Select which course this semester belongs to</p>
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
                        disabled={uploading || !semesterName.trim() || !description.trim() || !courseCategory}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Semester'
                        )}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

export default FormCreateSemester