"use client"

import React from 'react'
import { Sparkles, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import BillingFeatures from '@/components/billing/BillingFeatures'
import BillingBenefits from '@/components/billing/BillingBenefits'
import ClerkPricingTable from '@/components/billing/ClerkPricingTable'

const Billing = () => {
    return (
        <div className="w-full bg-gradient-to-br from-gray-50 overflow-hidden via-blue-50 to-purple-50 dark:from-[rgb(24,24,24)] dark:via-[rgb(28,28,32)] dark:to-[rgb(32,28,36)]">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto mb-12 px-6 pt-6">
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
                <BillingFeatures />

                {/* Benefits List */}
                <BillingBenefits />
            </div>

            {/* Pricing Table */}
            <div className="max-w-7xl mx-auto px-6">
                <ClerkPricingTable />
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