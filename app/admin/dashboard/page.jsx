"use client"


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload, BookOpen, GraduationCap, FileText, Calendar, Users, Settings, Plus, Eye, Edit, Trash2, Download } from 'lucide-react';

const EducationDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [courses, setCourses] = useState([
        { id: 1, name: 'Data Structures', description: 'Complete DSA course', type: 'pdf', uploadDate: '2024-01-15' },
        { id: 2, name: 'Database Systems', description: 'DBMS fundamentals', type: 'docs', uploadDate: '2024-01-10' }
    ]);

    const [libraries, setLibraries] = useState([
        {
            id: 1,
            course: 'MCA',
            totalSemesters: 6,
            semesters: [
                {
                    sem: 1,
                    active: true,
                    subjects: ['Programming Fundamentals', 'Mathematics', 'Computer Organization', 'English Communication']
                },
                {
                    sem: 2,
                    active: true,
                    subjects: ['Data Structures', 'Database Systems', 'Operating Systems', 'Software Engineering']
                },
                {
                    sem: 3,
                    active: false,
                    subjects: ['Web Development', 'Computer Networks', 'Algorithm Analysis', 'System Programming']
                },
                {
                    sem: 4,
                    active: false,
                    subjects: ['Machine Learning', 'Mobile Development', 'Cloud Computing', 'Project Management']
                },
                {
                    sem: 5,
                    active: false,
                    subjects: ['AI & ML Advanced', 'Blockchain', 'IoT Systems', 'Research Methodology']
                },
                {
                    sem: 6,
                    active: false,
                    subjects: ['Final Project', 'Industry Training', 'Thesis Writing', 'Professional Ethics']
                }
            ]
        },
        {
            id: 2,
            course: 'BCA',
            totalSemesters: 6,
            semesters: [
                {
                    sem: 1,
                    active: true,
                    subjects: ['C Programming', 'Mathematics I', 'Digital Electronics', 'English']
                },
                {
                    sem: 2,
                    active: true,
                    subjects: ['C++ Programming', 'Mathematics II', 'Computer Architecture', 'Environmental Studies']
                },
                {
                    sem: 3,
                    active: false,
                    subjects: ['Java Programming', 'Data Structures', 'DBMS', 'Web Technologies']
                },
                {
                    sem: 4,
                    active: false,
                    subjects: ['Software Engineering', 'Computer Networks', 'Operating Systems', 'Python Programming']
                },
                {
                    sem: 5,
                    active: false,
                    subjects: ['Web Development', 'Mobile Apps', 'Graphics & Multimedia', 'Project Work']
                },
                {
                    sem: 6,
                    active: false,
                    subjects: ['Final Project', 'Internship', 'Seminar', 'Industry Readiness']
                }
            ]
        }
    ]);

    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: '', description: '', file: null });

    const handleCourseUpload = () => {
        if (newCourse.name && newCourse.description) {
            const course = {
                id: Date.now(),
                name: newCourse.name,
                description: newCourse.description,
                type: 'pdf',
                uploadDate: new Date().toISOString().split('T')[0]
            };
            setCourses([...courses, course]);
            setNewCourse({ name: '', description: '', file: null });
            setIsUploadDialogOpen(false);
        }
    };

    const toggleSemesterStatus = (libraryId, semesterIndex) => {
        setLibraries(prev => prev.map(lib => {
            if (lib.id === libraryId) {
                const newSemesters = [...lib.semesters];
                newSemesters[semesterIndex] = { ...newSemesters[semesterIndex], active: !newSemesters[semesterIndex].active };
                return { ...lib, semesters: newSemesters };
            }
            return lib;
        }));
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
            ? 'bg-[rgb(38,38,36)] text-white'
            : 'bg-white text-gray-900'
            }`}>
            <div className="flex">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -250 }}
                    animate={{ x: 0 }}
                    className={`w-64 min-h-screen p-6 border-r transition-colors duration-300 ${isDarkMode
                        ? 'bg-black/20 border-gray-700/50 text-white'
                        : 'bg-gray-100 border-gray-200 text-gray-900'
                        }`}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <GraduationCap className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>EduDash</h1>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
                            { id: 'courses', label: 'Course Upload', icon: Upload },
                            { id: 'library', label: 'Library', icon: FileText },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? 'default' : 'ghost'}
                                className={`w-full justify-start gap-3 transition-colors duration-200 ${activeTab === item.id
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : isDarkMode
                                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to your educational management system</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className={`transition-colors duration-300 ${isDarkMode
                                        ? 'bg-black/20 border-gray-700'
                                        : 'bg-white border-gray-200 shadow-sm'
                                        }`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                <Upload className="w-5 h-5 text-blue-400" />
                                                Total Courses
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-blue-400">{courses.length}</div>
                                        </CardContent>
                                    </Card>

                                    <Card className={`transition-colors duration-300 ${isDarkMode
                                        ? 'bg-black/20 border-gray-700'
                                        : 'bg-white border-gray-200 shadow-sm'
                                        }`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                <BookOpen className="w-5 h-5 text-green-400" />
                                                Library Programs
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-green-400">{libraries.length}</div>
                                        </CardContent>
                                    </Card>

                                    <Card className={`transition-colors duration-300 ${isDarkMode
                                        ? 'bg-black/20 border-gray-700'
                                        : 'bg-white border-gray-200 shadow-sm'
                                        }`}>
                                        <CardHeader className="pb-3">
                                            <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                <Users className="w-5 h-5 text-purple-400" />
                                                Active Semesters
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-purple-400">
                                                {libraries.reduce((acc, lib) => acc + lib.semesters.filter(sem => sem.active).length, 0)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity */}
                                <Card className={`transition-colors duration-300 ${isDarkMode
                                    ? 'bg-black/20 border-gray-700'
                                    : 'bg-white border-gray-200 shadow-sm'
                                    }`}>
                                    <CardHeader>
                                        <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Recent Uploads</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {courses.slice(-3).map((course) => (
                                                <motion.div
                                                    key={course.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${isDarkMode ? 'bg-black/30' : 'bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-blue-400" />
                                                        <div>
                                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{course.name}</p>
                                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.description}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary">{course.type}</Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Course Upload Tab */}
                        {activeTab === 'courses' && (
                            <motion.div
                                key="courses"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Course Upload</h2>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload and manage your course materials</p>
                                    </div>

                                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Upload Course
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className={`border transition-colors duration-300 ${isDarkMode
                                            ? 'bg-[rgb(38,38,36)] border-gray-700 text-white'
                                            : 'bg-white border-gray-200 text-gray-900'
                                            }`}>
                                            <DialogHeader>
                                                <DialogTitle>Upload New Course</DialogTitle>
                                                <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                    Add course materials to your library
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="courseName">Course Name</Label>
                                                    <Input
                                                        id="courseName"
                                                        placeholder="Enter course name"
                                                        value={newCourse.name}
                                                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                                        className={`transition-colors duration-200 ${isDarkMode
                                                            ? 'bg-black/20 border-gray-600 text-white'
                                                            : 'bg-white border-gray-300 text-gray-900'
                                                            }`}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="courseDesc">Description</Label>
                                                    <Textarea
                                                        id="courseDesc"
                                                        placeholder="Enter course description"
                                                        value={newCourse.description}
                                                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                                        className={`transition-colors duration-200 ${isDarkMode
                                                            ? 'bg-black/20 border-gray-600 text-white'
                                                            : 'bg-white border-gray-300 text-gray-900'
                                                            }`}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="file">Upload File</Label>
                                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDarkMode
                                                        ? 'border-gray-600'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Drop your PDF or DOCX files here</p>
                                                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>or click to browse</p>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={handleCourseUpload}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Upload Course
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Courses List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card className={`transition-all duration-300 hover:scale-[1.02] ${isDarkMode
                                                ? 'bg-black/20 border-gray-700 hover:border-blue-500/50'
                                                : 'bg-white border-gray-200 hover:border-blue-400/50 shadow-sm hover:shadow-md'
                                                }`}>
                                                <CardHeader>
                                                    <CardTitle className={`flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {course.name}
                                                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                                                            {course.type}
                                                        </Badge>
                                                    </CardTitle>
                                                    <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                        {course.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center justify-between">
                                                        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                                            }`}>
                                                            <Calendar className="w-4 h-4" />
                                                            {course.uploadDate}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-green-400 border-green-400 hover:bg-green-400/10">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Library Tab */}
                        {activeTab === 'library' && (
                            <motion.div
                                key="library"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Library Management</h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage course programs and semester structure</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {libraries.map((library) => (
                                        <Card key={library.id} className={`transition-colors duration-300 ${isDarkMode
                                            ? 'bg-black/20 border-gray-700'
                                            : 'bg-white border-gray-200 shadow-sm'
                                            }`}>
                                            <CardHeader>
                                                <CardTitle className={`flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {library.course} Program
                                                    <Badge className="bg-blue-600">
                                                        {library.totalSemesters} Semesters
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {library.semesters.map((semester, index) => (
                                                        <motion.div
                                                            key={semester.sem}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className={`border rounded-lg p-4 transition-all duration-200 ${semester.active
                                                                ? isDarkMode
                                                                    ? 'border-green-500/50 bg-green-500/10'
                                                                    : 'border-green-400 bg-green-50'
                                                                : isDarkMode
                                                                    ? 'border-gray-600 bg-black/20'
                                                                    : 'border-gray-300 bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    Semester {semester.sem}
                                                                </h4>
                                                                <div className="flex items-center gap-3">
                                                                    <Label htmlFor={`sem-${library.id}-${index}`} className="text-sm">
                                                                        {semester.active ? 'Active' : 'Inactive'}
                                                                    </Label>
                                                                    <Switch
                                                                        id={`sem-${library.id}-${index}`}
                                                                        checked={semester.active}
                                                                        onCheckedChange={() => toggleSemesterStatus(library.id, index)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subjects:</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {semester.subjects.map((subject, subIndex) => (
                                                                        <Badge
                                                                            key={subIndex}
                                                                            variant="secondary"
                                                                            className={`text-xs transition-colors duration-200 ${semester.active
                                                                                ? isDarkMode
                                                                                    ? 'bg-green-600/20 text-green-400 border-green-500'
                                                                                    : 'bg-green-100 text-green-700 border-green-300'
                                                                                : isDarkMode
                                                                                    ? 'bg-gray-600/20 text-gray-400 border-gray-600'
                                                                                    : 'bg-gray-100 text-gray-600 border-gray-300'
                                                                                }`}
                                                                        >
                                                                            {subject}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (




                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configure your dashboard preferences</p>
                                </div>

                                <Card className={`transition-colors duration-300 ${isDarkMode
                                    ? 'bg-black/20 border-gray-700'
                                    : 'bg-white border-gray-200 shadow-sm'
                                    }`}>
                                    <CardHeader>
                                        <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>General Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className={isDarkMode ? 'text-white' : 'text-gray-900'}>Email Notifications</Label>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive updates about course uploads</p>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className={isDarkMode ? 'text-white' : 'text-gray-900'}>Auto-backup</Label>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Automatically backup course data</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className={isDarkMode ? 'text-white' : 'text-gray-900'}>Dark Mode</Label>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Use dark theme</p>
                                            </div>
                                            <Switch
                                                checked={isDarkMode}
                                                onCheckedChange={setIsDarkMode}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>



                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EducationDashboard;