"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function CTASection({ onDashboard }) {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Learning Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who are already acing their exams with Ezy Learn.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={onDashboard}
                            className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                            Get Started Now - It&apos;s Free!
                        </button>
                        <Link href="/reviews">
                            <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
                                Leave a Review
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
