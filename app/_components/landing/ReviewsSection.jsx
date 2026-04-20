"use client";

import Link from "next/link";
import { MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useFeaturedReviews } from '@/hooks/useCourses';
import { motion } from "motion/react";
import ReviewSkeleton from './skeletons/ReviewSkeleton';

export default function ReviewsSection() {
    const { data: reviewsData, isLoading } = useFeaturedReviews();
    const reviews = Array.isArray(reviewsData) ? reviewsData : [];
    const featuredReviewIds = new Set(
        reviews
            .slice(0, 2)
            .map((review) => review?.id)
            .filter(Boolean)
    );

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const avatarColors = [
        'bg-purple-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-fuchsia-500',
    ];

    const half = Math.ceil(reviews.length / 2);
    const topReviews = reviews.slice(0, half);
    const bottomReviews = reviews.slice(half);

    const topLoop = [...topReviews, ...topReviews, ...topReviews];
    const bottomLoop = [...bottomReviews, ...bottomReviews, ...bottomReviews];

    return (
        <section className="relative py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[rgb(42,42,38)] dark:via-[rgb(38,38,36)] dark:to-[rgb(35,35,33)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(59,130,246,0.12), transparent 28%), radial-gradient(circle at 80% 12%, rgba(14,165,233,0.12), transparent 22%)' }} />
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative text-center mb-14">
                    <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 mb-6 border border-blue-200/80 dark:border-blue-400/20">
                        Student Feedback
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 flex items-center justify-center gap-3">

                        Loved by Thousands of Students
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        Real learning journeys from students who trust Ezylearn for notes, preparation, and semester success.
                    </p>
                </motion.div>

                {isLoading ? (
                    <ReviewSkeleton />
                ) : reviews.length > 0 ? (
                    <>
                        <div className="relative">
                            {/* Fade edges */}
                            <div className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10 bg-gradient-to-r from-white dark:from-[rgb(38,38,36)] to-transparent" />
                            <div className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10 bg-gradient-to-l from-white dark:from-[rgb(38,38,36)] to-transparent" />

                            <div className="flex flex-col gap-6">

                                {/* Row 1 — Left scroll */}
                                <div className="overflow-hidden">
                                    <div
                                        className="flex gap-5 w-max"
                                        style={{ animation: 'scrollLeft 55s linear infinite' }}
                                    >
                                        {topLoop.map((review, i) => (
                                            <ReviewCard
                                                key={`top-${i}`}
                                                review={review}
                                                index={i}
                                                getInitials={getInitials}
                                                avatarColors={avatarColors}
                                                isFeatured={featuredReviewIds.has(review?.id) && i < topReviews.length}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Row 2 — Right scroll */}
                                <div className="overflow-hidden">
                                    <div
                                        className="flex gap-5 w-max"
                                        style={{ animation: 'scrollRight 65s linear infinite' }}
                                    >
                                        {bottomLoop.map((review, i) => (
                                            <ReviewCard
                                                key={`bottom-${i}`}
                                                review={review}
                                                index={i}
                                                getInitials={getInitials}
                                                avatarColors={avatarColors}
                                                isFeatured={featuredReviewIds.has(review?.id) && i < bottomReviews.length}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* View All Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-14">
                            <Link href="/reviews">
                                <button className="px-9 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_18px_38px_rgba(6,182,212,0.35)] border border-white/20 flex items-center justify-center gap-2 mx-auto">
                                    View All Reviews
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </motion.div>
                    </>
                ) : (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        <p>No reviews yet. Be the first to leave a review!</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scrollLeft {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                @keyframes scrollRight {
                    0%   { transform: translateX(-33.333%); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </section>
    );
}

function ReviewCard({ review, index, getInitials, avatarColors, isFeatured }) {
    const avatarBg = avatarColors[index % avatarColors.length];
    const userImage = review?.image;

    return (
        <div className="
            min-w-[295px] max-w-[295px] flex-shrink-0 rounded-2xl p-5
            flex flex-col justify-between gap-4
            bg-white/75 dark:bg-[rgba(40,40,36,0.72)] backdrop-blur-xl
            border border-slate-200/80 dark:border-slate-700/80
            shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(2,6,23,0.3)]
            hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)] dark:hover:shadow-[0_18px_40px_rgba(2,6,23,0.45)]
            transition-all duration-300 hover:-translate-y-1
            ${isFeatured ? 'ring-1 ring-blue-300/80 dark:ring-cyan-400/30 min-w-[330px] max-w-[330px]' : ''}
        ">
            {/* Top: Avatar + Name */}
            <div className="flex items-center gap-3">
                {userImage ? (
                    <div className="relative w-12 h-12 rounded-full flex-shrink-0 shadow-md ring-2 ring-white/70 dark:ring-slate-800 overflow-hidden">
                        <img
                            src={userImage}
                            alt={review.userName || 'User'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${avatarBg} shadow-md ring-2 ring-white/70 dark:ring-slate-800`}>
                        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
                        {getInitials(review.userName)}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-base leading-tight truncate">
                        {review.userName}
                    </p>
                    {isFeatured && (
                        <p className="text-xs font-semibold text-blue-600 dark:text-cyan-300 mt-1">Featured Student Voice</p>
                    )}
                </div>
            </div>

            {/* Review Text */}
            <p className="text-slate-700 dark:text-slate-200 text-sm leading-7 line-clamp-4 flex-1 font-medium">
                {review.reviewText}
            </p>

            {/* Bottom: Rating */}
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {review.rating}/5
                    </span>
                    <div className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-400/20">
                        {[...Array(5)].map((_, si) => (
                            <Star
                                key={si}
                                className={`w-3.5 h-3.5 ${si < review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'}`}
                            />
                        ))}
                    </div>
                </div>

                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-400/20">
                    Verified Review
                </span>
            </div>
        </div>
    );
}