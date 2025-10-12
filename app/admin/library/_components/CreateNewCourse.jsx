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
        name: "",
        code: "",
        description: "",
        duration: "",
        totalSemesters: ""
    });

    const handleCreateCourse = async () => {
        try {
            const response = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(courseForm)
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Course created successfully!");
                setCourseForm({
                    name: "",
                    code: "",
                    description: "",
                    duration: "",
                    totalSemesters: ""
                });
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
                        <Label htmlFor="courseName">Course Name</Label>
                        <Input
                            id="courseName"
                            value={courseForm.name}
                            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                            placeholder="e.g., Master of Computer Applications"
                        />
                    </div>
                    <div>
                        <Label htmlFor="courseCode">Course Code</Label>
                        <Input
                            id="courseCode"
                            value={courseForm.code}
                            onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toLowerCase() })}
                            placeholder="e.g., mca"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="duration">Duration (years)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={courseForm.duration}
                                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                placeholder="e.g., 2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="totalSemesters">Total Semesters</Label>
                            <Input
                                id="totalSemesters"
                                type="number"
                                value={courseForm.totalSemesters}
                                onChange={(e) => setCourseForm({ ...courseForm, totalSemesters: e.target.value })}
                                placeholder="e.g., 4"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                            placeholder="Course description..."
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