"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, FileText, Upload, Trash2, Edit, Calendar, Users, Database, UserCog, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminLibraryPage() {
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [createCourseOpen, setCreateCourseOpen] = useState(false);
    const [createSemesterOpen, setCreateSemesterOpen] = useState(false);
    const [createSubjectOpen, setCreateSubjectOpen] = useState(false);
    const [createMaterialOpen, setCreateMaterialOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);

    // Form states
    const [courseForm, setCourseForm] = useState({
        name: "",
        code: "",
        description: "",
        duration: "",
        totalSemesters: ""
    });

    const [semesterForm, setSemesterForm] = useState({
        name: "",
        courseId: "",
        semesterNumber: "",
        description: ""
    });

    const [subjectForm, setSubjectForm] = useState({
        name: "",
        code: "",
        courseId: "",
        semesterId: "",
        description: "",
        credits: ""
    });

    const [materialForm, setMaterialForm] = useState({
        title: "",
        description: "",
        courseId: "",
        semesterId: "",
        subjectId: "",
        materialType: "",
        fileUrl: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [coursesRes, semestersRes, subjectsRes, materialsRes, usersRes] = await Promise.all([
                fetch("/api/admin/courses"),
                fetch("/api/admin/semesters"),
                fetch("/api/admin/subjects"),
                fetch("/api/admin/materials"),
                fetch("/api/admin/users")
            ]);

            const [coursesData, semestersData, subjectsData, materialsData, usersData] = await Promise.all([
                coursesRes.json(),
                semestersRes.json(),
                subjectsRes.json(),
                materialsRes.json(),
                usersRes.json()
            ]);

            if (coursesData.success) setCourses(coursesData.courses || []);
            if (semestersData.success) setSemesters(semestersData.semesters || []);
            if (subjectsData.success) setSubjects(subjectsData.subjects || []);
            if (materialsData.success) setMaterials(materialsData.materials || []);
            if (Array.isArray(usersData)) setUsers(usersData);

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(courseForm)
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Course created successfully!");
                setCourseForm({ name: "", code: "", description: "", duration: "", totalSemesters: "" });
                setCreateCourseOpen(false);
                fetchData();
            } else {
                toast.error(result.error || "Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            toast.error("Failed to create course");
        }
    };

    const handleCreateSemester = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/semesters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(semesterForm)
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Semester created successfully!");
                setSemesterForm({ name: "", courseId: "", semesterNumber: "", description: "" });
                setCreateSemesterOpen(false);
                fetchData();
            } else {
                toast.error(result.error || "Failed to create semester");
            }
        } catch (error) {
            console.error("Error creating semester:", error);
            toast.error("Failed to create semester");
        }
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/subjects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subjectForm)
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Subject created successfully!");
                setSubjectForm({ name: "", code: "", courseId: "", semesterId: "", description: "", credits: "" });
                setCreateSubjectOpen(false);
                fetchData();
            } else {
                toast.error(result.error || "Failed to create subject");
            }
        } catch (error) {
            console.error("Error creating subject:", error);
            toast.error("Failed to create subject");
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return null;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'study-materials');

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toast.success("File uploaded to Cloudinary!");
                return result.secure_url || result.file?.url;
            } else {
                toast.error(result.error || "Failed to upload file");
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file");
            return null;
        }
    };

    const handleCreateMaterial = async (e) => {
        e.preventDefault();
        try {
            let fileUrl = materialForm.fileUrl;

            // Upload file if selected
            if (uploadFile) {
                fileUrl = await handleFileUpload(uploadFile);
                if (!fileUrl) return; // Upload failed
            }

            const response = await fetch("/api/admin/materials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...materialForm,
                    fileUrl
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Material created successfully!");
                setMaterialForm({
                    title: "",
                    description: "",
                    courseId: "",
                    semesterId: "",
                    subjectId: "",
                    materialType: "",
                    fileUrl: ""
                });
                setUploadFile(null);
                setCreateMaterialOpen(false);
                fetchData();
            } else {
                toast.error(result.error || "Failed to create material");
            }
        } catch (error) {
            console.error("Error creating material:", error);
            toast.error("Failed to create material");
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (!confirm("Are you sure you want to delete this material?")) return;

        try {
            const response = await fetch(`/api/admin/materials?id=${materialId}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Material deleted successfully!");
                fetchData();
            } else {
                toast.error(result.error || "Failed to delete material");
            }
        } catch (error) {
            console.error("Error deleting material:", error);
            toast.error("Failed to delete material");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading library data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Library Management System</h1>
                    <p className="text-gray-600 mt-2">Complete course, semester, subject & material management</p>
                </div>
                <div className="flex gap-3">
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
                            <form onSubmit={handleCreateCourse} className="space-y-4">
                                <div>
                                    <Label htmlFor="courseName">Course Name</Label>
                                    <Input
                                        id="courseName"
                                        value={courseForm.name}
                                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                                        placeholder="e.g., Master of Computer Applications"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="courseCode">Course Code</Label>
                                    <Input
                                        id="courseCode"
                                        value={courseForm.code}
                                        onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toLowerCase() })}
                                        placeholder="e.g., mca"
                                        required
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
                                            required
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
                                            required
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
                                    <Button type="submit">Create Course</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={createSemesterOpen} onOpenChange={setCreateSemesterOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                New Semester
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Semester</DialogTitle>
                                <DialogDescription>Add a new semester to existing course</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSemester} className="space-y-4">
                                <div>
                                    <Label htmlFor="semesterName">Semester Name</Label>
                                    <Input
                                        id="semesterName"
                                        value={semesterForm.name}
                                        onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })}
                                        placeholder="e.g., First Semester"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="semesterCourseId">Select Course</Label>
                                        <Select value={semesterForm.courseId} onValueChange={(value) => setSemesterForm({ ...semesterForm, courseId: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem key={course.id} value={course.id.toString()}>
                                                        {course.name} ({course.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="semesterNumber">Semester Number</Label>
                                        <Input
                                            id="semesterNumber"
                                            type="number"
                                            value={semesterForm.semesterNumber}
                                            onChange={(e) => setSemesterForm({ ...semesterForm, semesterNumber: e.target.value })}
                                            placeholder="e.g., 1"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="semesterDescription">Description</Label>
                                    <Textarea
                                        id="semesterDescription"
                                        value={semesterForm.description}
                                        onChange={(e) => setSemesterForm({ ...semesterForm, description: e.target.value })}
                                        placeholder="Semester description..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setCreateSemesterOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Semester</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={createSubjectOpen} onOpenChange={setCreateSubjectOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <BookOpen className="w-4 h-4 mr-2" />
                                New Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Subject</DialogTitle>
                                <DialogDescription>Add a new subject to semester</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubject} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="subjectName">Subject Name</Label>
                                        <Input
                                            id="subjectName"
                                            value={subjectForm.name}
                                            onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                            placeholder="e.g., Data Structures"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="subjectCode">Subject Code</Label>
                                        <Input
                                            id="subjectCode"
                                            value={subjectForm.code}
                                            onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                                            placeholder="e.g., CS101"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="subjectCourseId">Select Course</Label>
                                        <Select value={subjectForm.courseId} onValueChange={(value) => setSubjectForm({ ...subjectForm, courseId: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem key={course.id} value={course.id.toString()}>
                                                        {course.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="subjectSemesterId">Select Semester</Label>
                                        <Select
                                            value={subjectForm.semesterId}
                                            onValueChange={(value) => setSubjectForm({ ...subjectForm, semesterId: value })}
                                            disabled={!subjectForm.courseId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select semester" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {semesters
                                                    .filter(sem => sem.courseId.toString() === subjectForm.courseId)
                                                    .map((semester) => (
                                                        <SelectItem key={semester.id} value={semester.id.toString()}>
                                                            {semester.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="credits">Credits</Label>
                                    <Input
                                        id="credits"
                                        type="number"
                                        value={subjectForm.credits}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                                        placeholder="e.g., 4"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="subjectDescription">Description</Label>
                                    <Textarea
                                        id="subjectDescription"
                                        value={subjectForm.description}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                                        placeholder="Subject description..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setCreateSubjectOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Subject</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={createMaterialOpen} onOpenChange={setCreateMaterialOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                New Material
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Upload Study Material</DialogTitle>
                                <DialogDescription>
                                    Add new study material with file upload
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateMaterial} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="title">Material Title</Label>
                                        <Input
                                            id="title"
                                            value={materialForm.title}
                                            onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                                            placeholder="e.g., Data Structures Notes"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="materialType">Material Type</Label>
                                        <Select value={materialForm.materialType} onValueChange={(value) => setMaterialForm({ ...materialForm, materialType: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="notes">Notes</SelectItem>
                                                <SelectItem value="assignment">Assignment</SelectItem>
                                                <SelectItem value="book">Book</SelectItem>
                                                <SelectItem value="presentation">Presentation</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={materialForm.description}
                                        onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                                        placeholder="Material description..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="materialCourseId">Select Course</Label>
                                        <Select value={materialForm.courseId} onValueChange={(value) => setMaterialForm({ ...materialForm, courseId: value, semesterId: "", subjectId: "" })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem key={course.id} value={course.id.toString()}>
                                                        {course.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="materialSemesterId">Select Semester</Label>
                                        <Select
                                            value={materialForm.semesterId}
                                            onValueChange={(value) => setMaterialForm({ ...materialForm, semesterId: value, subjectId: "" })}
                                            disabled={!materialForm.courseId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select semester" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {semesters
                                                    .filter(sem => sem.courseId.toString() === materialForm.courseId)
                                                    .map((semester) => (
                                                        <SelectItem key={semester.id} value={semester.id.toString()}>
                                                            {semester.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="materialSubjectId">Select Subject</Label>
                                        <Select
                                            value={materialForm.subjectId}
                                            onValueChange={(value) => setMaterialForm({ ...materialForm, subjectId: value })}
                                            disabled={!materialForm.semesterId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects
                                                    .filter(sub => sub.semesterId.toString() === materialForm.semesterId)
                                                    .map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                                            {subject.name} ({subject.code})
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="fileUpload">Upload File (PDF, DOC, PPT, etc.)</Label>
                                    <div className="mt-2 flex items-center gap-4">
                                        <Input
                                            id="fileUpload"
                                            type="file"
                                            onChange={(e) => setUploadFile(e.target.files[0])}
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {uploadFile && (
                                            <span className="text-sm text-green-600 flex items-center">
                                                <Upload className="w-4 h-4 mr-1" />
                                                {uploadFile.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setCreateMaterialOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Upload Material</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                        <p className="text-xs text-muted-foreground">Active courses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Semesters</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{semesters.length}</div>
                        <p className="text-xs text-muted-foreground">All semesters</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{subjects.length}</div>
                        <p className="text-xs text-muted-foreground">All subjects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{materials.length}</div>
                        <p className="text-xs text-muted-foreground">Total materials</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="courses" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="semesters">Semesters</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                {/* Courses Tab */}
                <TabsContent value="courses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Courses</CardTitle>
                            <CardDescription>Manage all available courses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map((course) => (
                                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between text-lg">
                                                {course.name}
                                                <Badge variant="secondary">{course.code}</Badge>
                                            </CardTitle>
                                            <CardDescription>{course.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>Duration: {course.duration} years</span>
                                                <span>Semesters: {course.totalSemesters || 'N/A'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {courses.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No courses created yet. Create your first course!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Semesters Tab */}
                <TabsContent value="semesters" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Semesters</CardTitle>
                            <CardDescription>Manage semesters for each course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {semesters.map((semester) => {
                                    const course = courses.find(c => c.id === semester.courseId);
                                    return (
                                        <div key={semester.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="font-medium">{semester.name}</h3>
                                                <p className="text-sm text-gray-600">{semester.description}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Badge variant="outline">{course?.name || 'Unknown Course'}</Badge>
                                                    <span className="text-xs text-gray-500">
                                                        Semester #{semester.semesterNumber}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {semesters.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No semesters created yet. Create semesters for your courses!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Subjects</CardTitle>
                            <CardDescription>Manage subjects for each semester</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {subjects.map((subject) => {
                                    const semester = semesters.find(s => s.id === subject.semesterId);
                                    const course = courses.find(c => c.id === subject.courseId);
                                    return (
                                        <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="font-medium">{subject.name}</h3>
                                                <p className="text-sm text-gray-600">{subject.description}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Badge variant="outline">{subject.code}</Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {course?.name} • {semester?.name}
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {subject.credits} Credits
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {subjects.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No subjects created yet. Create subjects for your semesters!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Materials Tab */}
                <TabsContent value="materials" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Study Materials</CardTitle>
                            <CardDescription>All uploaded study materials with Cloudinary integration</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {materials.map((material) => {
                                    const subject = subjects.find(s => s.id === parseInt(material.subjectId));
                                    const semester = semesters.find(s => s.id === parseInt(material.semesterId));
                                    const course = courses.find(c => c.id === parseInt(material.courseId));

                                    return (
                                        <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div className="flex-1">
                                                <h3 className="font-medium">{material.title}</h3>
                                                <p className="text-sm text-gray-600">{material.description}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Badge variant="secondary">{material.materialType}</Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {course?.name} • {semester?.name} • {subject?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {material.fileUrl && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => window.open(material.fileUrl, '_blank')}
                                                    >
                                                        <Upload className="w-4 h-4 mr-1" />
                                                        View File
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteMaterial(material.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {materials.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                        <p>No materials uploaded yet.</p>
                                        <p className="text-sm">Start by creating courses, semesters, and subjects first!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCog className="w-5 h-5" />
                                User Management
                            </CardTitle>
                            <CardDescription>
                                Manage user roles and permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Users List */}
                                {loading ? (
                                    <div className="text-center py-8">Loading users...</div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>No users found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <h3 className="font-medium">{user.name || 'Unknown User'}</h3>
                                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="flex items-center gap-1">
                                                                {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                                                {user.role}
                                                            </Badge>
                                                            <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                                                {user.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        <p>Enrollments: {user.active_enrollments || 0}</p>
                                                        <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`active-${user.id}`} className="text-sm">Active</Label>
                                                        <Switch
                                                            id={`active-${user.id}`}
                                                            checked={user.is_active}
                                                            onCheckedChange={async (checked) => {
                                                                try {
                                                                    const response = await fetch('/api/admin/users', {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({
                                                                            id: user.id,
                                                                            role: user.role,
                                                                            isActive: checked
                                                                        })
                                                                    });

                                                                    if (response.ok) {
                                                                        setUsers(users.map(u =>
                                                                            u.id === user.id
                                                                                ? { ...u, is_active: checked }
                                                                                : u
                                                                        ));
                                                                        toast.success(`User ${checked ? 'activated' : 'deactivated'}`);
                                                                    }
                                                                } catch (error) {
                                                                    toast.error('Failed to update user');
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <Select
                                                        value={user.role}
                                                        onValueChange={async (newRole) => {
                                                            try {
                                                                const response = await fetch('/api/admin/users', {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        id: user.id,
                                                                        role: newRole,
                                                                        isActive: user.is_active
                                                                    })
                                                                });

                                                                if (response.ok) {
                                                                    setUsers(users.map(u =>
                                                                        u.id === user.id
                                                                            ? { ...u, role: newRole }
                                                                            : u
                                                                    ));
                                                                    toast.success('User role updated');
                                                                }
                                                            } catch (error) {
                                                                toast.error('Failed to update user role');
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="student">Student</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}