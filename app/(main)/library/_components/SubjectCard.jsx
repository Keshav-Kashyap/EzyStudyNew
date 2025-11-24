
"use client"
import React, { useState, useEffect } from 'react';
import { Download, ArrowLeft, Loader2, Upload, Trash2, MoreVertical, Edit, Eye, Star } from 'lucide-react';
import { useParams } from "next/navigation";
import Link from 'next/link';
import SubjectActions from '@/app/admin/library/_components/SubjectActions';
import FormCreateMaterial from '@/app/admin/library/_components/formCreateMaterail';
import EditMaterialForm from './EditMaterialDialog';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const SubjectCard = ({ subject, onDownload, isAdmin, onUpdate }) => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [materialToEdit, setMaterialToEdit] = useState(null);
    const [deletingMaterialId, setDeletingMaterialId] = useState(null);
    const [localMaterials, setLocalMaterials] = useState(subject.materials || []);
    const [viewingPdf, setViewingPdf] = useState(null);

    // Update local materials when subject changes
    useEffect(() => {
        setLocalMaterials(subject.materials || []);
    }, [subject.materials]);

    const handleDeleteMaterial = async (material) => {
        setMaterialToDelete(material);
        setDeleteDialogOpen(true);
    };

    const handleEditMaterial = (material) => {
        setMaterialToEdit(material);
        setEditDialogOpen(true);
    };

    const handleTogglePopular = async (material) => {
        const newPopularStatus = !material.isPopular;
        const toastId = toast.loading(`${newPopularStatus ? 'Marking' : 'Unmarking'} as popular...`);

        try {
            const response = await fetch('/api/admin/materials/toggle-popular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    materialId: material.id,
                    isPopular: newPopularStatus
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Material ${newPopularStatus ? 'marked' : 'unmarked'} as popular!`, { id: toastId });
                onUpdate(); // Refresh the data
            } else {
                toast.error(data.error || 'Failed to update', { id: toastId });
            }
        } catch (error) {
            console.error('Error toggling popular:', error);
            toast.error('Failed to update popular status', { id: toastId });
        }
    };

    const confirmDelete = async () => {
        if (!materialToDelete) return;

        // Optimistic UI update - remove from local state immediately
        setDeletingMaterialId(materialToDelete.id);
        setLocalMaterials(prev => prev.filter(m => m.id !== materialToDelete.id));
        setDeleteDialogOpen(false);

        const toastId = toast.loading('Removing material...');

        try {
            setDeleting(true);
            const response = await fetch(`/api/admin/materials?id=${materialToDelete.id}&subjectId=${subject.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                if (data.isShared && data.remainingSubjects > 0) {
                    toast.success('Material removed from this subject!', {
                        id: toastId,
                        description: `Still available in ${data.remainingSubjects} other subject${data.remainingSubjects > 1 ? 's' : ''}`
                    });
                } else {
                    toast.success('Material removed from this subject!', { id: toastId });
                }
                setMaterialToDelete(null);
                onUpdate(); // Refresh the data from server
            } else {
                // Revert on error
                setLocalMaterials(subject.materials || []);
                toast.error(data.error || 'Failed to delete material', { id: toastId });
            }
        } catch (error) {
            console.error('Error deleting material:', error);
            // Revert on error
            setLocalMaterials(subject.materials || []);
            toast.error('Failed to delete material', { id: toastId });
        } finally {
            setDeleting(false);
            setDeletingMaterialId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-[rgb(24,24,24)] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {subject.name}
                    </h3>
                    {subject.code && (
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {subject.code}
                        </span>
                    )}
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Edit/Delete/Upload Actions */}
                        <SubjectActions
                            subject={subject}
                            onUpdate={onUpdate}
                            onUploadClick={() => setIsUploadOpen(true)}
                        />

                        {/* Upload Material Dialog */}
                        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                            <FormCreateMaterial
                                onClose={() => setIsUploadOpen(false)}
                                onSuccess={() => {
                                    setIsUploadOpen(false);
                                    onUpdate();
                                }}
                                prefilledSubjectCode={subject.code}
                            />
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Materials List */}
            <div className="space-y-3">
                {localMaterials && localMaterials.length > 0 ? (
                    localMaterials.map((material) => (
                        <div
                            key={material.id}
                            className={`flex items-center flex-wrap justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all duration-300 ${deletingMaterialId === material.id ? 'opacity-50 animate-pulse' : ''
                                }`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                        {material.title}
                                    </p>
                                    {material.isPopular && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                                            <Star className="h-3 w-3 fill-current" />
                                            Popular
                                        </span>
                                    )}
                                    {material.likes >= 10 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {material.likes} ❤️
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {material.type || 'PDF'} • {material.size || '2.5 MB'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setViewingPdf(material)}
                                    disabled={deletingMaterialId === material.id}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Eye className="h-4 w-4" />
                                    View
                                </button>
                                <button
                                    onClick={() => onDownload(material)}
                                    disabled={deletingMaterialId === material.id}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                                {isAdmin && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                disabled={deletingMaterialId === material.id}
                                                className="flex items-center justify-center w-9 h-9 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem
                                                onClick={() => handleTogglePopular(material)}
                                                className="cursor-pointer"
                                            >
                                                <Star className={`h-4 w-4 mr-2 ${material.isPopular ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                                {material.isPopular ? 'Remove from Popular' : 'Mark as Popular'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleEditMaterial(material)}
                                                className="cursor-pointer"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Material
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteMaterial(material)}
                                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Material
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No materials available
                    </p>
                )}
            </div>

            {/* Edit Material Dialog */}
            {materialToEdit && (
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="bg-white dark:bg-gray-800 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                Edit Material
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-400">
                                Update the material information below
                            </DialogDescription>
                        </DialogHeader>
                        <EditMaterialForm
                            material={materialToEdit}
                            onUpdate={() => {
                                setEditDialogOpen(false);
                                setMaterialToEdit(null);

                                // Show loading toast
                                const toastId = toast.loading('Refreshing materials...');

                                // Refresh data
                                onUpdate();

                                // Dismiss loading after a short delay
                                setTimeout(() => {
                                    toast.dismiss(toastId);
                                }, 500);
                            }}
                            onCancel={() => {
                                setEditDialogOpen(false);
                                setMaterialToEdit(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Delete Material
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete this material? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {materialToDelete && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {materialToDelete.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {materialToDelete.type || 'PDF'} • {materialToDelete.size || '2.5 MB'}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Material
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* PDF Viewer Dialog */}
            <Dialog open={!!viewingPdf} onOpenChange={() => setViewingPdf(null)}>
                <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 bg-gray-900 border-gray-700">
                    <DialogHeader className="p-4 border-b border-gray-700">
                        <DialogTitle className="text-white">
                            {viewingPdf?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="w-full h-[calc(95vh-80px)] overflow-hidden">
                        {viewingPdf && (
                            <iframe
                                src={viewingPdf.fileUrl}
                                className="w-full h-full border-0"
                                title={viewingPdf.title}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};


export default SubjectCard;