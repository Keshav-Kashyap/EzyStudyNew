"use client"

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
    Search,
    BookOpen,
    FileText,
    Clock,
    TrendingUp,
    X
} from 'lucide-react'
import Link from 'next/link'

const GlobalSearchDialog = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState({
        courses: [],
        notes: []
    })

    // Sample data - Replace with actual API calls
    const allCourses = [
        { id: 1, title: "MCA - Master of Computer Applications", category: "Computer Applications", documents: "120+ Documents" },
        { id: 2, title: "BCA - Bachelor of Computer Applications", category: "Computer Applications", documents: "85+ Documents" },
        { id: 3, title: "B.Tech Computer Science", category: "Engineering", documents: "200+ Documents" },
        { id: 4, title: "Data Structures and Algorithms", category: "MCA", documents: "45+ Documents" },
        { id: 5, title: "Database Management Systems", category: "MCA", documents: "38+ Documents" },
        { id: 6, title: "Web Development", category: "BCA", documents: "52+ Documents" }
    ]

    const allNotes = [
        { id: 1, title: "Introduction to Java Programming", course: "MCA", type: "PDF", date: "2024-01-15" },
        { id: 2, title: "Python Basics Tutorial", course: "BCA", type: "PDF", date: "2024-01-20" },
        { id: 3, title: "Advanced DSA Notes", course: "MCA", type: "PDF", date: "2024-02-01" },
        { id: 4, title: "React.js Complete Guide", course: "BCA", type: "PDF", date: "2024-02-10" },
        { id: 5, title: "SQL Query Examples", course: "MCA", type: "PDF", date: "2024-02-15" },
        { id: 6, title: "Operating Systems Notes", course: "B.Tech", type: "PDF", date: "2024-02-20" },
        { id: 7, title: "Machine Learning Basics", course: "MCA", type: "PDF", date: "2024-03-01" },
        { id: 8, title: "HTML CSS JavaScript", course: "BCA", type: "PDF", date: "2024-03-05" }
    ]

    // Search function
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults({ courses: [], notes: [] })
            return
        }

        const query = searchQuery.toLowerCase()

        // Filter courses
        const filteredCourses = allCourses.filter(course =>
            course.title.toLowerCase().includes(query) ||
            course.category.toLowerCase().includes(query)
        )

        // Filter notes
        const filteredNotes = allNotes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.course.toLowerCase().includes(query)
        )

        setSearchResults({
            courses: filteredCourses.slice(0, 5), // Limit to 5 results
            notes: filteredNotes.slice(0, 8) // Limit to 8 results
        })
    }, [searchQuery])

    const handleClose = () => {
        setSearchQuery('')
        setSearchResults({ courses: [], notes: [] })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-[rgb(38,38,36)]">
                <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-[rgb(45,45,44)]">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Search Everything
                    </DialogTitle>
                </DialogHeader>

                {/* Search Input */}
                <div className="p-6 pt-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        <Input
                            type="text"
                            placeholder="Search for courses, notes, tutorials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-6 text-lg bg-gray-50 dark:bg-[rgb(45,45,44)] border-2 border-gray-200 dark:border-[rgb(55,55,54)] focus:border-blue-500 dark:focus:border-blue-400"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 pb-6">
                    {searchQuery.trim() === '' ? (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Start typing to search for courses and notes
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* No Results */}
                            {searchResults.courses.length === 0 && searchResults.notes.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                                        No results found for "{searchQuery}"
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            )}

                            {/* Courses Results */}
                            {searchResults.courses.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Courses
                                        </h3>
                                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            {searchResults.courses.length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-3">
                                        {searchResults.courses.map((course) => (
                                            <Link
                                                key={course.id}
                                                href={`/dashboard/allCourses`}
                                                onClick={handleClose}
                                            >
                                                <Card className="p-4 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer bg-white dark:bg-[rgb(45,45,44)] border-2">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                                {course.title}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {course.category}
                                                                </Badge>
                                                                <span className="flex items-center gap-1">
                                                                    <FileText size={14} />
                                                                    {course.documents}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-20" />
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes Results */}
                            {searchResults.notes.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Notes
                                        </h3>
                                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                            {searchResults.notes.length}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {searchResults.notes.map((note) => (
                                            <Link
                                                key={note.id}
                                                href={`/dashboard/popular`}
                                                onClick={handleClose}
                                            >
                                                <Card className="p-4 hover:shadow-lg hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 cursor-pointer bg-white dark:bg-[rgb(45,45,44)] border-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                                                                {note.title}
                                                            </h4>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {note.course}
                                                                </Badge>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={12} />
                                                                    {new Date(note.date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Stats Footer */}
                {searchQuery.trim() !== '' && (searchResults.courses.length > 0 || searchResults.notes.length > 0) && (
                    <div className="p-4 border-t border-gray-200 dark:border-[rgb(45,45,44)] bg-gray-50 dark:bg-[rgb(45,45,44)]">
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-2">
                                <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                                {searchResults.courses.length + searchResults.notes.length} Results Found
                            </span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default GlobalSearchDialog
