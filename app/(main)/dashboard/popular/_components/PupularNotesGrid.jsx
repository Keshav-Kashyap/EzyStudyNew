import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GenericCard from '../../../_components/shared/GenericCard';
import { toast } from 'sonner';

import {
    Download,
    Share2,
    TrendingUp,
    FileText,
    Calendar,
    Heart
} from "lucide-react";
import HeroHeader from '../../_components/HeroHeader';

const PopularNotesGrid = () => {
    const [popularNotes, setPopularNotes] = useState([]);
    console.log(popularNotes);
    const [loading, setLoading] = useState(true);
    const [likedNotes, setLikedNotes] = useState(new Set());

    useEffect(() => {
        fetchNotes();
    }, []);

    // Load liked notes from localStorage (persist per-browser)
    useEffect(() => {
        try {
            const raw = localStorage.getItem('likedNotes');
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) setLikedNotes(new Set(arr));
            }
        } catch (e) {
            console.warn('Failed to load liked notes from localStorage', e);
        }
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/popularNotes");
            const data = await res.json();

            if (res.ok) {
                setPopularNotes(data);
            } else {
                setPopularNotes([]);
            }
        } catch (err) {
            console.error("Error fetching notes:", err);
            setPopularNotes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (note) => {
        const link = document.createElement('a');
        link.href = note.fileUrl;
        link.target = '_blank';
        link.download = `${note.title}.${note.type.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = (note) => {
        if (navigator.share) {
            navigator.share({
                title: note.title,
                text: note.description,
                url: note.fileUrl
            });

            toast.success("Shared successfully!");
        } else {
            alert(`Share: ${note.title}`);

        }

    };


    const handleToggleLike = async (noteId) => {
        const newLiked = new Set(likedNotes);

        let liked;
        if (newLiked.has(noteId)) {
            newLiked.delete(noteId);
            liked = false;
        } else {
            newLiked.add(noteId);
            liked = true;
        }

        setLikedNotes(newLiked);

        // Persist liked IDs to localStorage so state survives refresh (per-browser)
        try {
            localStorage.setItem('likedNotes', JSON.stringify(Array.from(newLiked)));
        } catch (e) {
            console.warn('Failed to save liked notes to localStorage', e);
        }

        // Optimistic UI update
        setPopularNotes(prev =>
            prev.map(note =>
                note.id === noteId
                    ? { ...note, likes: liked ? note.likes + 1 : note.likes - 1 }
                    : note
            )
        );

        try {
            await fetch("/api/likeNote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: noteId, liked }),
            });
        } catch (err) {
            console.error("Error toggling like:", err);
            // Revert on error
            setLikedNotes(prev => {
                const reverted = new Set(prev);
                if (liked) {
                    reverted.delete(noteId);
                } else {
                    reverted.add(noteId);
                }
                try {
                    localStorage.setItem('likedNotes', JSON.stringify(Array.from(reverted)));
                } catch (e) {
                    console.warn('Failed to save liked notes to localStorage', e);
                }
                return reverted;
            });
            setPopularNotes(prev =>
                prev.map(note =>
                    note.id === noteId
                        ? { ...note, likes: liked ? note.likes - 1 : note.likes + 1 }
                        : note
                )
            );
        }
    };

    return (

        <>

            <HeroHeader heading="Popular Notes" subHeading=" Discover comprehensive learning materials designed for academic excellence" icon={TrendingUp} />

            <div className="grid gap-2 grid-cols-1 mb-15 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    // Improved loading skeleton
                    Array.from({ length: 6 }).map((_, idx) => (
                        <Card key={idx} className="overflow-hidden">
                            <div className="relative">
                                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                    <div className="w-10 h-6 rounded-md bg-gray-300 dark:bg-gray-600 animate-pulse" />
                                </div>
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                    <div className="w-8 h-5 rounded bg-gray-300 dark:bg-gray-600 animate-pulse" />
                                </div>
                            </div>
                            <CardHeader className="pb-3">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex gap-2">
                                        <div className="w-20 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                        <div className="w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : popularNotes.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">No popular notes found</p>
                    </div>
                ) : (
                    popularNotes.map((note) => {
                        const formattedDate = note.createdAt
                            ? new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'N/A';
                        const isLiked = likedNotes.has(note.id);

                        return (
                            <GenericCard
                                key={note.id}
                                item={note}
                                imageUrl={note.imageUrl}
                                title={note.title}
                                subtitle={note.description}
                                showStats={false}
                                badges={[
                                    { label: 'Popular', position: 'top-right', bgColor: 'bg-yellow-400 text-yellow-900' },
                                    { label: note.type, position: 'top-left', bgColor: 'bg-white/30 backdrop-blur-sm text-white' }
                                ]}
                                stats={[
                                    {
                                        icon: <Download className="w-4 h-4 text-green-600 dark:text-green-400" />,
                                        label: '',
                                        value: note.downloadCount || 0,
                                        bgColor: 'bg-green-100 dark:bg-green-900/30'
                                    },
                                    {
                                        icon: <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
                                        label: '',
                                        value: formattedDate,
                                        bgColor: 'bg-slate-100 dark:bg-slate-800/50'
                                    }
                                ]}
                                actions={[
                                    {
                                        label: 'Download',
                                        onClick: () => handleDownload(note),
                                        fullWidth: true,
                                        icon: <Download className="w-4 h-4" />
                                    },
                                    {
                                        label: '',
                                        onClick: () => handleShare(note),
                                        variant: 'outline',
                                        icon: <Share2 className="w-4 h-4" />
                                    },
                                    {
                                        label: note.likes || 0,
                                        onClick: () => handleToggleLike(note.id),
                                        variant: 'outline',
                                        icon: <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked
                                            ? 'fill-red-500 text-red-500'
                                            : ''
                                            }`} />
                                    }
                                ]}
                            />
                        );
                    })
                )}
            </div>


        </>
    );
};

export default PopularNotesGrid;