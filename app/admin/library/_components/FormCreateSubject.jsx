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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCourses, useSemesters } from '@/hooks/useCourses'
import { useQueryClient } from '@tanstack/react-query'
import { courseKeys } from '@/hooks/useCourses'

const FormCreateSubject = ({ onClose, onSuccess, category, semesterName }) => {
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(category || '');
    const [selectedSemester, setSelectedSemester] = useState(semesterName || '');

    const queryClient = useQueryClient();

    // Update states when props change
    React.useEffect(() => {
        if (category) {
            setSelectedCourse(category);
        }
        if (semesterName) {
            setSelectedSemester(semesterName);
        }
    }, [category, semesterName]);

    // Fetch courses (only if category not provided)
    const { data: coursesData, isLoading: coursesLoading } = useCourses();
    const courses = coursesData || [];

    // Fetch semesters for selected course (only if semesterName not provided)
    const { data: semestersData, isLoading: semestersLoading } = useSemesters(selectedCourse);
    const semesters = semestersData?.semesters || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!subjectName || !subjectCode || !selectedCourse || !selectedSemester) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category: selectedCourse,
                    semesterName: selectedSemester,
                    name: subjectName,
                    code: subjectCode,
                    description: description || `Comprehensive study of ${subjectName}`
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Subject created successfully!');

                // Invalidate all relevant React Query caches to refresh data
                await Promise.all([
                    // Invalidate semester detail cache (for semester view)
                    queryClient.invalidateQueries({
                        queryKey: courseKeys.byCategory(selectedCourse)
                    }),
                    // Invalidate course detail cache (for course overview)
                    queryClient.invalidateQueries({
                        queryKey: courseKeys.detail(selectedCourse)
                    }),
                    // Invalidate all courses cache (for admin library page)
                    queryClient.invalidateQueries({
                        queryKey: courseKeys.all
                    })
                ]);

                // Call onSuccess callback
                onSuccess?.();

                // Close dialog
                onClose();

                // Reset form
                setSubjectName('');
                setSubjectCode('');
                setDescription('');
            } else {
                toast.error(data.error || 'Failed to create subject');
            }
        } catch (error) {
            console.error('Error creating subject:', error);
            toast.error('Failed to create subject');
        } finally {
            setLoading(false);
        }
    };

    // Determine if fields should be disabled (when auto-detected from URL)
    const isCourseAutoDetected = !!category;
    const isSemesterAutoDetected = !!semesterName;

    // Check if form is valid - be more explicit
    const hasSubjectName = subjectName && subjectName.trim().length > 0;
    const hasSubjectCode = subjectCode && subjectCode.trim().length > 0;
    const hasCourse = selectedCourse && selectedCourse.length > 0;
    const hasSemester = selectedSemester && selectedSemester.length > 0;

    const isFormValid = hasSubjectName && hasSubjectCode && hasCourse && hasSemester;

    return (
        <DialogContent className="bg-white dark:bg-[#2a2a28] border-gray-200 dark:border-[#3a3a38] text-gray-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl text-gray-900 dark:text-white">Create New Subject</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                    {isSemesterAutoDetected ? `Add a new subject to ${semesterName}` : 'Add a new subject to a semester'}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Course Selection */}
                {!isCourseAutoDetected && (
                    <div className="space-y-2">
                        <Label htmlFor="course" className="text-gray-900 dark:text-white">Course *</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={loading}>
                            <SelectTrigger className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white">
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a28] border-[#3a3a38]">
                                {coursesLoading ? (
                                    <SelectItem value="loading" disabled>Loading courses...</SelectItem>
                                ) : courses.length === 0 ? (
                                    <SelectItem value="none" disabled>No courses available</SelectItem>
                                ) : (
                                    courses.map((course) => (
                                        <SelectItem key={course.category} value={course.category} className="text-white">
                                            {course.title}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Semester Selection */}
                {!isSemesterAutoDetected && selectedCourse && (
                    <div className="space-y-2">
                        <Label htmlFor="semester" className="text-gray-900 dark:text-white">Semester *</Label>
                        <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={loading}>
                            <SelectTrigger className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white">
                                <SelectValue placeholder="Select a semester" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a28] border-[#3a3a38]">
                                {semestersLoading ? (
                                    <SelectItem value="loading" disabled>Loading semesters...</SelectItem>
                                ) : semesters.length === 0 ? (
                                    <SelectItem value="none" disabled>No semesters available</SelectItem>
                                ) : (
                                    semesters.map((semester) => (
                                        <SelectItem key={semester.id} value={semester.name} className="text-white">
                                            {semester.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Show current course if auto-detected */}
                {isCourseAutoDetected && (
                    <div className="space-y-2">
                        <Label className="text-gray-900 dark:text-white">Course</Label>
                        <div className="px-3 py-2 bg-white dark:bg-[#1a1a18] border border-gray-300 dark:border-[#3a3a38] rounded-md text-gray-600 dark:text-gray-400">
                            {category}
                        </div>
                    </div>
                )}

                {/* Show current semester if auto-detected */}
                {isSemesterAutoDetected && (
                    <div className="space-y-2">
                        <Label className="text-gray-900 dark:text-white">Semester</Label>
                        <div className="px-3 py-2 bg-white dark:bg-[#1a1a18] border border-gray-300 dark:border-[#3a3a38] rounded-md text-gray-600 dark:text-gray-400">
                            {semesterName}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="subject-name" className="text-gray-900 dark:text-white">Subject Name *</Label>
                    <Input
                        id="subject-name"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        placeholder="e.g., Data Structures and Algorithms"
                        className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-500"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject-code" className="text-gray-900 dark:text-white">Subject Code *</Label>
                    <Input
                        id="subject-code"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                        placeholder="e.g., CS101"
                        className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-500"
                        disabled={loading}
                        required
                    />
                    <p className="text-xs text-gray-500">Unique code for this subject</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-900 dark:text-white">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter subject description..."
                        className="bg-white dark:bg-[#1a1a18] border-gray-300 dark:border-[#3a3a38] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-500 min-h-[120px] resize-none"
                        disabled={loading}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                        disabled={loading || !isFormValid}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Subject'
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}

export default FormCreateSubject
