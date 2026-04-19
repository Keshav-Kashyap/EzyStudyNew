"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2, MessageSquare, User, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const ReviewsPage = () => {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    useEffect(() => {
        if (isSignedIn) {
            fetchReviews();
        }
    }, [isSignedIn]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/reviews/');
            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews || []);
            } else {
                toast.error(data.error || 'Failed to load reviews');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (reviewId, nextFeaturedState) => {
        const previousReviews = reviews;
        setReviews((currentReviews) =>
            currentReviews.map((review) =>
                review.id === reviewId
                    ? { ...review, isFeatured: nextFeaturedState }
                    : review
            )
        );

        setUpdatingId(reviewId);
        try {
            const response = await fetch('/api/admin/reviews/featured', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewId,
                    isFeatured: nextFeaturedState,
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message || 'Review updated');
            } else {
                setReviews(previousReviews);
                toast.error(data.error || 'Failed to update review');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            setReviews(previousReviews);
            toast.error('Failed to update review');
        } finally {
            setUpdatingId(null);
        }
    };

    const summary = useMemo(() => {
        const totalReviews = reviews.length;
        const featuredReviews = reviews.filter((review) => review.isFeatured).length;
        const averageRating = totalReviews
            ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews).toFixed(1)
            : '0.0';
        const latestReviewDate = reviews[0]?.createdAt
            ? new Date(reviews[0].createdAt).toLocaleDateString()
            : 'N/A';

        return [
            { label: 'Total Reviews', value: totalReviews, icon: MessageSquare, tone: 'from-blue-500 to-cyan-500' },
            { label: 'Featured Reviews', value: featuredReviews, icon: Sparkles, tone: 'from-amber-500 to-orange-500' },
            { label: 'Average Rating', value: averageRating, icon: Star, tone: 'from-emerald-500 to-teal-500' },
            { label: 'Latest Review', value: latestReviewDate, icon: TrendingUp, tone: 'from-violet-500 to-fuchsia-500' },
        ];
    }, [reviews]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[rgb(38,38,36)]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isSignedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[rgb(32,32,30)] dark:to-[rgb(38,38,36)] py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center">
                    <Badge className="mb-4 rounded-full px-4 py-1 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300">
                        Admin Reviews
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Review Management
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        View all user reviews and mark any review as featured for the public spotlight.
                    </p>
                </motion.div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}>
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summary.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#2a2a26]"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{item.label}</p>
                                        <div className={`rounded-xl bg-gradient-to-br p-2 text-white ${item.tone}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Reviews List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4">
                    <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            All Reviews
                        </h2>
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Only admins can feature reviews
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="grid gap-4">
                            {reviews.map((review, i) => (
                                <motion.div
                                    key={review.id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}>
                                    <Card className="border border-slate-200/80 shadow-sm dark:border-slate-700">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                                                    {review.userName?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                                    {review.userName || 'Anonymous'}
                                                                </h3>
                                                                {review.isFeatured ? (
                                                                    <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300">
                                                                        Featured
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="rounded-full">
                                                                        Not Featured
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="mt-2 flex flex-wrap items-center gap-1">
                                                                {[...Array(5)].map((_, idx) => (
                                                                    <Star
                                                                        key={idx}
                                                                        className={`w-4 h-4 ${idx < review.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300 dark:text-gray-600'
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                                                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70 shrink-0">
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                                                    Featured
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {review.isFeatured ? 'Visible on featured list' : 'Tap to feature'}
                                                                </p>
                                                            </div>
                                                            <Switch
                                                                checked={Boolean(review.isFeatured)}
                                                                onCheckedChange={(checked) => handleToggleFeatured(review.id, checked)}
                                                                disabled={updatingId === review.id}
                                                                aria-label={`Toggle featured state for ${review.userName || 'Anonymous'}`}
                                                                className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600"
                                                            />
                                                            {updatingId === review.id && (
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-700 dark:text-gray-300 mt-4 leading-7">
                                                        {review.reviewText}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No reviews yet. Be the first to share your experience!
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ReviewsPage;
