"use client";

import { motion } from "motion/react";
import { FileText, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            icon: FileText,
            title: "Complete Notes",
            desc: "Access comprehensive study notes for all subjects with detailed explanations and examples"
        },
        {
            icon: BookOpen,
            title: "Structured Learning",
            desc: "Follow our curated learning path with proper sequence - know which subject to study first"
        },
        {
            icon: TrendingUp,
            title: "Best YouTube Channels",
            desc: "Get recommendations for top YouTube channels for each subject to enhance your learning"
        },
        {
            icon: CheckCircle,
            title: "Complete Syllabus",
            desc: "Access full curriculum with proper structure, semester-wise breakdown and exam patterns"
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Why Choose Ezy Learn?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Everything you need to excel in your studies, all in one place.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                            <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
