"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useReviews } from '@/hooks/useCourses';

export default function ReviewsSection() {
    const { data: reviewsData, isLoading } = useReviews();
    const reviews = Array.isArray(reviewsData) ? reviewsData.slice(0, 3) : [];

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <section className="py-20 bg-white dark:bg-[rgb(38,38,36)]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                        <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        What Students Say
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Trusted by thousands of students nationwide
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-64 animate-pulse" />
                        ))}
                    </div>
                ) : reviews && reviews.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-3 gap-8">
                            {reviews.map((review, i) => (
                                <motion.div
                                    key={review.id || i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {getInitials(review.userName)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{review.userName}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, starIndex) => (
                                            <Star
                                                key={starIndex}
                                                className={`w-5 h-5 ${starIndex < review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 italic line-clamp-3">&quot;{review.reviewText}&quot;</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Reviews Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mt-12">
                            <Link href="/reviews">
                                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 mx-auto">
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
        </section>
    );
}
