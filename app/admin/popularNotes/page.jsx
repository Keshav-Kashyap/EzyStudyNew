"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Heart, TrendingUp, Eye, MoreVertical, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminPopularNotesPage() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPopularNotes();
    }, []);

    const fetchPopularNotes = async () => {
        try {
            setLoading(true);

            // Fetch popular notes from API
            const response = await fetch("/api/popularNotes");
            const notesData = await response.json();
            console.log("Popular notes data:", notesData);

            // API returns array directly
            if (Array.isArray(notesData)) {
                // Sort by likes (most popular first)
                const sortedNotes = notesData.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                setNotes(sortedNotes);
            } else {
                console.error("Expected array but got:", notesData);
                setNotes([]);
            }
        } catch (error) {
            console.error("Error fetching popular notes:", error);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center dark:bg-[rgb(38,38,36)] justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading popular notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container dark:bg-[rgb(38,38,36)] mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        Popular Notes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Most liked and downloaded study materials with popular tag</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search popular notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
                </Badge>
            </div>

            {/* Popular Notes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note, index) => (
                    <Card key={note.id} className="relative hover:shadow-lg transition-shadow dark:hover:bg-[rgb(45,45,44)]">
                        {/* Popularity Rank Badge */}
                        {index < 3 && (
                            <div className="absolute -top-2 -right-2 z-10">
                                <Badge className={`${index === 0 ? 'bg-yellow-500 text-white' :
                                    index === 1 ? 'bg-gray-400 text-white' :
                                        'bg-orange-600 text-white'
                                    }`}>
                                    <Star className="h-3 w-3 mr-1 inline" />
                                    #{index + 1}
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                                        {note.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                        {note.description || "Study material"}
                                    </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* File Type Badge */}
                            <div className="mb-4">
                                <Badge variant="outline" className="text-xs">
                                    {note.type || 'PDF'}
                                </Badge>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <Heart className="h-4 w-4 text-red-500 mr-1 fill-red-500" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{note.likes || 0}</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <Download className="h-4 w-4 text-green-600 mr-1" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{note.downloadCount || 0}</p>
                                </div>
                            </div>

                            {/* Tags */}
                            {note.tags && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {(() => {
                                        try {
                                            const tagArray = typeof note.tags === 'string' ? JSON.parse(note.tags) : note.tags;
                                            return tagArray.slice(0, 3).map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ));
                                        } catch (e) {
                                            return null;
                                        }
                                    })()}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                                <Button variant="outline" size="sm" className="text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No popular notes found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchQuery ? "Try adjusting your search query" : "Add 'popular' tag to materials to show them here"}
                    </p>
                </div>
            )}

            {/* Summary Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Popular Notes Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{filteredNotes.length}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Popular Notes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">
                                {filteredNotes.reduce((sum, note) => sum + (note.likes || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {filteredNotes.reduce((sum, note) => sum + (note.downloadCount || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {Math.round(filteredNotes.reduce((sum, note) => sum + (note.likes || 0), 0) / (filteredNotes.length || 1))}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Likes</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}