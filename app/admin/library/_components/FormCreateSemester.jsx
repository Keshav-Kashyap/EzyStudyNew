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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const FormCreateSemester = ({ onClose, courseId }) => {
    const [semesterName, setSemesterName] = useState('')
    const [semesterNumber, setSemesterNumber] = useState(1)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const handleSubmit = async () => {
        // Validation
        if (!semesterName.trim()) {
            toast.error('Please enter semester name')
            return
        }

        if (!courseId) {
            toast.error('Course ID is required')
            return
        }

        setUploading(true)

        try {
            // Create request body
            const requestBody = {
                courseId: courseId,
                name: semesterName.trim(),
                semesterNumber: parseInt(semesterNumber),
                description: description.trim() || null
            }

            // Submit to API
            const response = await fetch('/api/admin/semesters', {
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
                setSemesterNumber(1)
                setDescription('')

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
        <DialogContent className="bg-white dark:bg-[#2a2a28] border-gray-200 dark:border-[#3a3a38] text-gray-900 dark:text-white max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl text-gray-900 dark:text-white">Create New Semester</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Add a new semester to this course
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
                <div className="space-y-2">
                    <Label htmlFor="semester-name" className="text-gray-900 dark:text-white">Semester Name *</Label>
                    <Input
                        id="semester-name"
                        value={semesterName}
                        onChange={(e) => setSemesterName(e.target.value)}
                        placeholder="e.g., Semester 1, First Semester"
                        className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        disabled={uploading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="semester-number" className="text-gray-900 dark:text-white">Semester Number *</Label>
                    <Input
                        id="semester-number"
                        type="number"
                        min="1"
                        max="12"
                        value={semesterNumber}
                        onChange={(e) => setSemesterNumber(parseInt(e.target.value) || 1)}
                        placeholder="1"
                        className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-500"
                        disabled={uploading}
                    />
                    <p className="text-xs text-gray-500">Enter the semester sequence number (1-12)</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter semester description (optional)..."
                        className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-500 min-h-[120px] resize-none"
                        disabled={uploading}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={onClose}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={uploading || !semesterName.trim() || !courseId}
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