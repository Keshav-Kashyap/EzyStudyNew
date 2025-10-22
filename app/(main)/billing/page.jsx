"use client"

import { PricingTable } from '@clerk/nextjs'
import React from 'react'
import { Sparkles, Crown, Zap, Check, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'

const Billing = () => {
    const { theme, resolvedTheme } = useTheme()
    const currentTheme = theme === 'system' ? resolvedTheme : theme

    return (


        <div className="w-full bg-gradient-to-br from-gray-50 overflow-hidden via-blue-50 to-purple-50 dark:from-[rgb(24,24,24)] dark:via-[rgb(28,28,32)] dark:to-[rgb(32,28,36)]">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto  mb-12 px-6 pt-6">
                <div className="text-center space-y-4 mb-8">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none px-4 py-1.5 text-sm font-medium">
                        <Sparkles className="w-4 h-4 mr-2 inline" />
                        Pricing Plans
                    </Badge>

                    <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                        Choose Your Plan
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Unlock premium features and take your learning to the next level
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            icon: Crown,
                            title: "Premium Content",
                            description: "Access to all premium courses and study materials",
                            gradient: "from-yellow-500 to-orange-500"
                        },
                        {
                            icon: Zap,
                            title: "Unlimited Access",
                            description: "Download unlimited notes and resources",
                            gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                            icon: Check,
                            title: "Priority Support",
                            description: "Get help whenever you need it with 24/7 support",
                            gradient: "from-purple-500 to-pink-500"
                        }
                    ].map((feature, index) => (
                        <Card key={index} className="border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white dark:bg-[rgb(38,38,36)]">
                            <CardHeader>
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Benefits List */}
                <Card className="border-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[rgb(38,38,46)] dark:to-[rgb(46,38,46)] mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            What You'll Get
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Access to all MCA, BCA & B.Tech courses",
                                "Unlimited note downloads",
                                "Exclusive study materials",
                                "Priority customer support",
                                "Ad-free experience",
                                "Early access to new features",
                                "Certificate of completion",
                                "Community forum access"
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pricing Table */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-white dark:bg-[rgb(38,38,36)] rounded-2xl border-2 border-gray-200 dark:border-[rgb(45,45,44)] p-8 shadow-2xl">
                    <PricingTable
                        appearance={{
                            variables: {
                                colorPrimary: currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
                                colorBackground: currentTheme === 'dark' ? 'rgb(38,38,36)' : '#ffffff',
                                colorText: currentTheme === 'dark' ? '#ffffff' : '#111827',
                                colorTextSecondary: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
                                colorInputBackground: currentTheme === 'dark' ? 'rgb(45,45,44)' : '#f9fafb',
                                colorInputText: currentTheme === 'dark' ? '#ffffff' : '#111827',
                                colorDanger: currentTheme === 'dark' ? '#ef4444' : '#dc2626',
                            },
                            elements: {
                                card: {
                                    backgroundColor: currentTheme === 'dark' ? 'rgb(45,45,44)' : '#ffffff',
                                    borderColor: currentTheme === 'dark' ? 'rgb(55,55,54)' : '#e5e7eb',
                                    color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                                    boxShadow: currentTheme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                },
                                cardTitle: {
                                    color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                                    fontWeight: '600',
                                },
                                cardDescription: {
                                    color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280',
                                },
                                badge: {
                                    backgroundColor: currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
                                    color: '#ffffff',
                                },
                                pricingCard: {
                                    backgroundColor: currentTheme === 'dark' ? 'rgb(45,45,44)' : '#ffffff',
                                    borderColor: currentTheme === 'dark' ? 'rgb(55,55,54)' : '#e5e7eb',
                                },
                                pricingCardPrice: {
                                    color: currentTheme === 'dark' ? '#ffffff' : '#111827',
                                },
                                pricingCardFeature: {
                                    color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                                },
                                pricingCardFeatureIcon: {
                                    color: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                    fill: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                },
                                button: {
                                    backgroundColor: currentTheme === 'dark' ? '#3b82f6' : '#2563eb',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: currentTheme === 'dark' ? '#2563eb' : '#1d4ed8',
                                    }
                                },
                                // Fix for check icons and all SVG icons
                                rootBox: {
                                    '& svg': {
                                        color: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                        fill: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                    },
                                    '& path': {
                                        fill: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                        stroke: currentTheme === 'dark' ? '#ffffff !important' : '#111827 !important',
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Trust Badge */}
            <div className="max-w-7xl mx-auto mt-12 pb-6 text-center px-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Trusted by 1000+ students
                    <span className="mx-2">•</span>
                    <Check className="w-4 h-4 text-green-500" />
                    Cancel anytime
                    <span className="mx-2">•</span>
                    <Check className="w-4 h-4 text-green-500" />
                    Money-back guarantee
                </p>
            </div>
        </div>


    )
}

export default Billing