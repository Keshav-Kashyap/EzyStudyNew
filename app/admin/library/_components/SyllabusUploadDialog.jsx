"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SyllabusUploadDialog({ category, year: defaultYear, onUploadSuccess, trigger }) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        year: defaultYear || 1,
        title: "",
        description: "",
        fileUrl: "",
        imageUrl: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fileUrl) {
            toast.error("Please provide syllabus file URL");
            return;
        }

        try {
            setUploading(true);

            const response = await fetch("/api/admin/syllabus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category,
                    year: formData.year,
                    title: formData.title || `${category} Year ${formData.year} Syllabus`,
                    description: formData.description,
                    fileUrl: formData.fileUrl,
                    imageUrl: formData.imageUrl
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Syllabus uploaded successfully!");
                setFormData({
                    year: defaultYear || 1,
                    title: "",
                    description: "",
                    fileUrl: "",
                    imageUrl: ""
                });
                setOpen(false);
                if (onUploadSuccess) onUploadSuccess();
            } else {
                toast.error(data.error || "Failed to upload syllabus");
            }
        } catch (error) {
            console.error("Error uploading syllabus:", error);
            toast.error("Failed to upload syllabus");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Syllabus
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Course Syllabus</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="year">Academic Year *</Label>
                        <Select
                            value={formData.year.toString()}
                            onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
                                <SelectItem value="5">5th Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder={`${category} Year ${formData.year} Syllabus`}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="fileUrl">Syllabus File URL *</Label>
                        <Input
                            id="fileUrl"
                            type="url"
                            value={formData.fileUrl}
                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                            placeholder="https://drive.google.com/..."
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="imageUrl">Thumbnail URL (Optional)</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <Button type="submit" disabled={uploading} className="w-full">
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Syllabus
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
