"use client";

import PricingTable from '@/app/(main)/billing/_components/PricingTable';

export default function BillingSection() {
    return (
        <section id="billing" className="w-full py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-[rgb(24,24,24)] dark:via-[rgb(28,28,32)] dark:to-[rgb(32,28,36)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Our Plans
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Unlock premium features and take your learning to the next level
                    </p>
                </div>

                {/* Custom Pricing Table */}
                <PricingTable />
            </div>
        </section>
    );
}
