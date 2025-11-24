"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Mail, Github } from 'lucide-react';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-4xl mx-auto mb-12">
            <Card className="border-2 bg-white dark:bg-[rgb(38,38,36)] shadow-2xl">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Get In Touch
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                        Have a question or want to collaborate? We'd love to hear from you!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Your Name *
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-50 dark:bg-[rgb(45,45,44)] border-gray-200 dark:border-[rgb(55,55,54)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address *
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-50 dark:bg-[rgb(45,45,44)] border-gray-200 dark:border-[rgb(55,55,54)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Subject *
                            </label>
                            <Input
                                type="text"
                                name="subject"
                                placeholder="What's this about?"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="bg-gray-50 dark:bg-[rgb(45,45,44)] border-gray-200 dark:border-[rgb(55,55,54)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Message *
                            </label>
                            <Textarea
                                name="message"
                                placeholder="Tell us more about your query or idea..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="bg-gray-50 dark:bg-[rgb(45,45,44)] border-gray-200 dark:border-[rgb(55,55,54)] resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                        </Button>
                    </form>

                    {/* Contact Info */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                            Other Ways to Reach Us
                        </h3>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a
                                href="mailto:support@ezylearn.com"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                support@ezylearn.com
                            </a>
                            <a
                                href="https://github.com/Keshav-Kashyap/ezy-study"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                                GitHub Repository
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
