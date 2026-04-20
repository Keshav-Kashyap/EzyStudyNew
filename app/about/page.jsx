"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProjectStatsSection from '@/components/about/ProjectStatsSection'
import TeamSection from '@/components/about/TeamSection'
import ContactSection from '@/components/about/ContactSection'

const JoinUs = () => {
    const router = useRouter()

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-[rgb(24,24,24)] dark:via-[rgb(28,28,32)] dark:to-[rgb(32,28,36)]">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-6 pb-12">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 backdrop-blur-sm transition hover:bg-white hover:text-blue-800 dark:border-[rgb(55,55,54)] dark:bg-[rgb(38,38,36)] dark:text-blue-300 dark:hover:bg-[rgb(45,45,44)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="text-center space-y-4 mb-12">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none px-4 py-1.5 text-sm font-medium">
                        <Users className="w-4 h-4 mr-2 inline" />
                        About us
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
                <ProjectStatsSection />

                {/* Team Members */}
                <TeamSection />

                {/* Contact Form Section */}
                <ContactSection />
            </div>
        </div>
    )
}

export default JoinUs
