"use client"

import React, { useState } from 'react'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditCourseDialog from './EditCourseDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'

const CourseActions = ({ course, onUpdate }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditOpen(true)
                        }}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            setDeleteOpen(true)
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Course
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <EditCourseDialog
                course={course}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onUpdate}
            />

            {/* Delete Dialog */}
            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={() => {
                    // Handle delete
                    onUpdate()
                }}
                title="Delete Course"
                description={`Are you sure you want to delete "${course.name}"? This action cannot be undone.`}
                itemId={course.id}
                endpoint="/api/admin/courses"
            />
        </>
    )
}

export default CourseActions
