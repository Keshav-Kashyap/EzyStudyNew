"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Mail,
    MessageSquare,
    Github,
    Linkedin,
    Twitter,
    Send,
    Heart,
    Code,
    Rocket,
    Star
} from 'lucide-react'

const JoinUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Add your form submission logic here
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // Team Members Data
    const teamMembers = [
        {
            name: "Keshav Kashyap",
            role: "Full Stack Developer",
            photo: "🧑‍💻",
            github: "https://github.com/Keshav-Kashyap",
            linkedin: "#",
            twitter: "#",
            bio: "Passionate about building scalable web applications"
        },
        {
            name: "Team Member 2",
            role: "Frontend Developer",
            photo: "👨‍💻",
            github: "#",
            linkedin: "#",
            twitter: "#",
            bio: "Creating beautiful user experiences"
        },
        {
            name: "Team Member 3",
            role: "Backend Developer",
            photo: "👩‍💻",
            github: "#",
            linkedin: "#",
            twitter: "#",
            bio: "Building robust backend systems"
        },
        {
            name: "Team Member 4",
            role: "UI/UX Designer",
            photo: "🎨",
            github: "#",
            linkedin: "#",
            twitter: "#",
            bio: "Designing intuitive interfaces"
        }
    ]

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-[rgb(24,24,24)] dark:via-[rgb(28,28,32)] dark:to-[rgb(32,28,36)]">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
                <div className="text-center space-y-4 mb-12">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none px-4 py-1.5 text-sm font-medium">
                        <Users className="w-4 h-4 mr-2 inline" />
                        Join Our Team
                    </Badge>

                    <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                        Meet Our Team
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
                        We're a passionate team dedicated to making learning accessible and enjoyable for everyone.
                        Get in touch with us to collaborate or join our mission!
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { icon: Users, label: "Team Members", value: "4+", gradient: "from-blue-500 to-cyan-500" },
                        { icon: Code, label: "Projects", value: "10+", gradient: "from-purple-500 to-pink-500" },
                        { icon: Rocket, label: "Students Helped", value: "1000+", gradient: "from-yellow-500 to-orange-500" },
                        { icon: Heart, label: "Happy Users", value: "95%", gradient: "from-green-500 to-emerald-500" }
                    ].map((stat, index) => (
                        <Card key={index} className="border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white dark:bg-[rgb(38,38,36)]">
                            <CardContent className="p-6 text-center">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Team Members Grid */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 flex items-center justify-center gap-2">
                        <Star className="w-8 h-8 text-yellow-500" />
                        Our Amazing Team
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white dark:bg-[rgb(38,38,36)] overflow-hidden">
                                <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                <CardHeader className="text-center -mt-12">
                                    <div className="w-24 h-24 mx-auto bg-white dark:bg-[rgb(45,45,44)] rounded-full flex items-center justify-center text-5xl border-4 border-white dark:border-[rgb(38,38,36)] shadow-lg mb-4">
                                        {member.photo}
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                        {member.name}
                                    </CardTitle>
                                    <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">
                                        {member.role}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {member.bio}
                                    </p>
                                    <div className="flex justify-center gap-3">
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[rgb(45,45,44)] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[rgb(55,55,54)] transition-colors"
                                        >
                                            <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                        </a>
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </a>
                                        <a
                                            href={member.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                                        >
                                            <Twitter className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="max-w-4xl mx-auto">
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
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Info */}
                <div className="mt-12 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
            </div>
        </div>
    )
}

export default JoinUs
