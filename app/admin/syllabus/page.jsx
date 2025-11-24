"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Trash2, Eye, Download, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminSyllabusPage() {
    const [syllabi, setSyllabi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        category: "",
        year: 1,
        title: "",
        description: "",
        fileUrl: "",
        imageUrl: ""
    });

    const courses = [
        { value: "MCA Integrated", label: "MCA Integrated" },
        { value: "MCA", label: "MCA" },
        { value: "BCA", label: "BCA" },
        { value: "BTech", label: "BTech" }
    ];

    useEffect(() => {
        fetchSyllabi();
    }, []);

    const fetchSyllabi = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/syllabus");
            const data = await response.json();

            if (data.success) {
                setSyllabi(data.syllabi || []);
            }
        } catch (error) {
            console.error("Error fetching syllabi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category || !formData.title || !formData.fileUrl) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            setUploading(true);

            const response = await fetch("/api/admin/syllabus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                alert("Syllabus uploaded successfully!");
                setFormData({
                    category: "",
                    year: 1,
                    title: "",
                    description: "",
                    fileUrl: "",
                    imageUrl: ""
                });
                fetchSyllabi();
            } else {
                alert(data.error || "Failed to upload syllabus");
            }
        } catch (error) {
            console.error("Error uploading syllabus:", error);
            alert("Failed to upload syllabus");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this syllabus?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/syllabus/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                alert("Syllabus deleted successfully!");
                fetchSyllabi();
            } else {
                alert(data.error || "Failed to delete syllabus");
            }
        } catch (error) {
            console.error("Error deleting syllabus:", error);
            alert("Failed to delete syllabus");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen dark:bg-[rgb(38,38,36)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading syllabi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 dark:bg-[rgb(38,38,36)] space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        Manage Syllabus
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Upload and manage course syllabi for integrated programs
                    </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {syllabi.length} Syllabus Files
                </Badge>
            </div>

            {/* Upload Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload New Syllabus
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Course Category */}
                            <div>
                                <Label htmlFor="category">Course Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course.value} value={course.value}>
                                                {course.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Year */}
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
                        </div>

                        {/* Title */}
                        <div>
                            <Label htmlFor="title">Syllabus Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., MCA Integrated 1st Year Syllabus"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the syllabus..."
                                rows={3}
                            />
                        </div>

                        {/* File URL */}
                        <div>
                            <Label htmlFor="fileUrl">Syllabus File URL (PDF/DOC) *</Label>
                            <Input
                                id="fileUrl"
                                type="url"
                                value={formData.fileUrl}
                                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                placeholder="https://drive.google.com/..."
                                required
                            />
                        </div>

                        {/* Image URL (Optional) */}
                        <div>
                            <Label htmlFor="imageUrl">Thumbnail Image URL (Optional)</Label>
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
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
                </CardContent>
            </Card>

            {/* Syllabi List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {syllabi.map((syllabus) => (
                    <Card key={syllabus.id} className="hover:shadow-lg transition-shadow dark:hover:bg-[rgb(45,45,44)]">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                        {syllabus.title}
                                    </CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            {syllabus.category}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            Year {syllabus.year}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {syllabus.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {syllabus.description}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => window.open(syllabus.fileUrl, '_blank')}
                                >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => window.open(syllabus.fileUrl, '_blank')}
                                >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(syllabus.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                Uploaded: {new Date(syllabus.createdAt).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {syllabi.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No syllabi uploaded yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload your first syllabus using the form above
                    </p>
                </div>
            )}
        </div>
    );
}
