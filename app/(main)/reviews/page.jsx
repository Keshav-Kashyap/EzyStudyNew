"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, Loader2, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';
import EzyLoader from '../_components/Loading';

const ReviewsPage = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

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
        try {
            const response = await fetch('/api/reviews');
            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        if (!reviewText.trim()) {
            toast.error('Please write your review');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    reviewText: reviewText.trim(),
                    userName: user?.fullName || user?.firstName || 'Anonymous',
                    userEmail: user?.emailAddresses?.[0]?.emailAddress
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Review submitted successfully!');
                setRating(0);
                setReviewText('');
                fetchReviews();
            } else {
                toast.error(data.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isLoaded || !isSignedIn) {
        return <EzyLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[rgb(38,38,36)] py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Share Your Experience
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Help us improve by sharing your feedback
                    </p>
                </motion.div>

                {/* Review Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Write a Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Rating Stars */}
                            <div className="space-y-2">
                                <Label>Rating *</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110">
                                            <Star
                                                className={`w-10 h-10 ${(hoverRating || rating) >= star
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                                    </p>
                                )}
                            </div>

                            {/* Review Text */}
                            <div className="space-y-2">
                                <Label htmlFor="review">Your Review *</Label>
                                <Textarea
                                    id="review"
                                    placeholder="Tell us about your experience with Ezy Learn..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={6}
                                    className="resize-none"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {reviewText.length} / 500 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmitReview}
                                disabled={submitting || !rating || !reviewText.trim()}
                                className="w-full">
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Review
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Reviews List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Recent Reviews
                    </h2>

                    {loading ? (
                        <div className="grid gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
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
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-4">
                                                {review.image ? (
                                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-md">
                                                        <img
                                                            src={review.image}
                                                            alt={review.userName || 'User'}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                        {review.userName?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                                {review.userName || 'Anonymous'}
                                                            </h3>
                                                            <div className="flex gap-1 mt-1">
                                                                {[...Array(5)].map((_, idx) => (
                                                                    <Star
                                                                        key={idx}
                                                                        className={`w-4 h-4 ${idx < review.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300 dark:text-gray-600'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
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
