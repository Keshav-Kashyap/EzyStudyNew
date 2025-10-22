import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CreateCourseForm({ onCourseCreated }) {
    const [createCourseOpen, setCreateCourseOpen] = useState(false);
    const [courseForm, setCourseForm] = useState({
        title: "",
        category: "",
        description: "",
        subtitle: "",
        duration: 3
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCreateCourse = async () => {
        try {
            if (!courseForm.title || !courseForm.category || !courseForm.duration) {
                toast.error("Please fill in all required fields");
                return;
            }

            // Create FormData to match API expectations
            const formData = new FormData();
            formData.append('title', courseForm.title);
            formData.append('category', courseForm.category);
            formData.append('description', courseForm.description);
            formData.append('subtitle', courseForm.subtitle);
            formData.append('duration', courseForm.duration.toString());

            // Add image if selected
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch("/api/admin/courses", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toast.success(`Course created successfully with ${courseForm.duration * 2} automatic semesters!`);
                setCourseForm({
                    title: "",
                    category: "",
                    description: "",
                    subtitle: "",
                    duration: 3
                });
                setSelectedImage(null);
                setImagePreview(null);
                setCreateCourseOpen(false);
                if (onCourseCreated) onCourseCreated();
            } else {
                toast.error(result.error || "Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            toast.error("Failed to create course");
        }
    };

    return (
        <Dialog open={createCourseOpen} onOpenChange={setCreateCourseOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Course
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>
                        Add a new course to the library system
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="courseTitle">Course Title *</Label>
                        <Input
                            id="courseTitle"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            placeholder="e.g., Master of Computer Applications"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="courseCategory">Course Category *</Label>
                            <Input
                                id="courseCategory"
                                value={courseForm.category}
                                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value.toLowerCase() })}
                                placeholder="e.g., mca, bca"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="courseDuration">Duration (Years) *</Label>
                            <Input
                                id="courseDuration"
                                type="number"
                                min="1"
                                max="6"
                                value={courseForm.duration}
                                onChange={(e) => setCourseForm({ ...courseForm, duration: parseInt(e.target.value) || 3 })}
                                placeholder="3"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Will create {courseForm.duration * 2} semesters automatically
                            </p>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="courseSubtitle">Course Subtitle</Label>
                        <Input
                            id="courseSubtitle"
                            value={courseForm.subtitle}
                            onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                            placeholder="e.g., Advanced Computing Program"
                        />
                    </div>
                    <div>
                        <Label htmlFor="courseImage">Course Image</Label>
                        <Input
                            id="courseImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="cursor-pointer"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-24 h-16 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                            placeholder="Course description..."
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setCreateCourseOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleCreateCourse}>
                            Create Course
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}