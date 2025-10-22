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

const EditSemesterDialog = ({ semester, open, onOpenChange, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        semesterNumber: 1,
        description: ''
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (semester && open) {
            setFormData({
                name: semester.name || '',
                semesterNumber: semester.semesterNumber || 1,
                description: semester.description || ''
            })
        }
    }, [semester, open])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`/api/admin/semesters/${semester.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Semester updated successfully!')
                onSuccess?.()
                onOpenChange(false)
            } else {
                throw new Error(result.error || 'Failed to update semester')
            }
        } catch (error) {
            console.error('Update error:', error)
            toast.error(error.message || 'Failed to update semester')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white dark:bg-[#2a2a28] border dark:border-[#3a3a38] max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-900 dark:text-white">
                        Edit Semester
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Update semester information
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 dark:text-white">
                            Semester Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Semester 1"
                            className="bg-gray-50 dark:bg-[#1a1a18] border-gray-200 dark:border-[#3a3a38]"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="semesterNumber" className="text-gray-900 dark:text-white">
                            Semester Number *
                        </Label>
                        <Input
                            id="semesterNumber"
                            type="number"
                            min="1"
                            max="12"
                            value={formData.semesterNumber}
                            onChange={(e) => setFormData({ ...formData, semesterNumber: parseInt(e.target.value) || 1 })}
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
                            placeholder="Semester description..."
                            className="bg-gray-50 dark:bg-[#1a1a18] border-gray-200 dark:border-[#3a3a38] min-h-[100px]"
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

export default EditSemesterDialog
