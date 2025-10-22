"use client"

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const EditCourseDialog = ({ course, open, onOpenChange, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        duration: 3
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (course && open) {
            setFormData({
                name: course.name || '',
                code: course.code || '',
                description: course.description || '',
                duration: course.duration || 3
            })
        }
    }, [course, open])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name.trim() || !formData.code.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`/api/admin/courses/${course.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Course updated successfully!')
                onSuccess?.()
                onOpenChange(false)
            } else {
                throw new Error(result.error || 'Failed to update course')
            }
        } catch (error) {
            console.error('Update error:', error)
            toast.error(error.message || 'Failed to update course')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-[#2a2a28] border dark:border-[#3a3a38] max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-900 dark:text-white">
                        Edit Course
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Update course information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 dark:text-white">
                            Course Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Master of Computer Applications"
                            className="bg-gray-50 dark:bg-[#1a1a18] border-gray-200 dark:border-[#3a3a38]"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-gray-900 dark:text-white">
                            Course Code *
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., MCA"
                            className="bg-gray-50 dark:bg-[#1a1a18] border-gray-200 dark:border-[#3a3a38]"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-900 dark:text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Course description..."
                            className="bg-gray-50 dark:bg-[#1a1a18] border-gray-200 dark:border-[#3a3a38] min-h-[100px]"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration" className="text-gray-900 dark:text-white">
                            Duration (in years) *
                        </Label>
                        <Input
                            id="duration"
                            type="number"
                            min="1"
                            max="6"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                            className="bg-gray-50 dark:bg-[#1a1a18] border-gray-200 dark:border-[#3a3a38]"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditCourseDialog
