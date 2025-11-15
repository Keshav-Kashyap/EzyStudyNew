"use client"

import React, { useState } from 'react'
import { MoreVertical, Edit, Trash2, Copy, Upload } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import EditSubjectDialog from './EditSubjectDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import CopySubjectDialog from './CopySubjectDialog'

const SubjectActions = ({ subject, onUpdate, onUploadClick }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [copyOpen, setCopyOpen] = useState(false)

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
                <DropdownMenuContent align="end" className="w-56">
                    {onUploadClick && (
                        <>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onUploadClick()
                                }}
                                className="cursor-pointer text-green-600 dark:text-green-400 focus:text-green-600 dark:focus:text-green-400"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Material
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            setCopyOpen(true)
                        }}
                        className="cursor-pointer text-blue-600 dark:text-blue-400 focus:text-blue-600 dark:focus:text-blue-400"
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to Another Course
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditOpen(true)
                        }}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Subject
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            setDeleteOpen(true)
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Subject
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Copy Dialog */}
            <CopySubjectDialog
                isOpen={copyOpen}
                onClose={() => setCopyOpen(false)}
                subject={subject}
                onSuccess={onUpdate}
            />

            {/* Edit Dialog */}
            <EditSubjectDialog
                subject={subject}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={onUpdate}
            />

            {/* Delete Dialog */}
            <DeleteConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={() => {
                    onUpdate()
                }}
                title="Delete Subject"
                description={`Are you sure you want to delete "${subject.name}"? This will also delete all associated materials. This action cannot be undone.`}
                itemId={subject.id}
                endpoint="/api/admin/subjects"
            />
        </>
    )
}

export default SubjectActions
