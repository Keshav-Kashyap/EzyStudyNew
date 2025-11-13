"use client"
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

const EditMaterialForm = ({ material, onUpdate, onCancel }) => {
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        title: material.title || '',
        description: material.description || '',
        type: material.type || 'PDF',
        fileUrl: material.fileUrl || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            setUpdating(true);
            const response = await fetch('/api/admin/materials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: material.id,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Material updated successfully!');
                onUpdate();
            } else {
                toast.error(data.error || 'Failed to update material');
            }
        } catch (error) {
            console.error('Error updating material:', error);
            toast.error('Failed to update material');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title" className="text-gray-900 dark:text-white">
                    Title *
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter material title"
                    className="mt-1"
                    required
                />
            </div>

            <div>
                <Label htmlFor="description" className="text-gray-900 dark:text-white">
                    Description
                </Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter material description"
                    className="mt-1"
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="type" className="text-gray-900 dark:text-white">
                    Type
                </Label>
                <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., PDF, Video, Notes"
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="fileUrl" className="text-gray-900 dark:text-white">
                    File URL
                </Label>
                <Input
                    id="fileUrl"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="Enter file URL"
                    className="mt-1"
                    type="url"
                />
            </div>

            <DialogFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={updating}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {updating ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update Material'
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default EditMaterialForm;
