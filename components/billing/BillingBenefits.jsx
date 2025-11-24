import { Sparkles, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingBenefits() {
    const benefits = [
        "Access to all MCA, BCA & B.Tech courses",
        "Unlimited note downloads",
        "Exclusive study materials",
        "Priority customer support",
        "Ad-free experience",
        "Early access to new features",
        "Certificate of completion",
        "Community forum access"
    ];

    return (
        <Card className="border-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[rgb(38,38,46)] dark:to-[rgb(46,38,46)] mb-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    What You'll Get
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
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
    );
}
