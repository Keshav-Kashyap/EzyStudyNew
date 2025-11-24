import { Crown, Zap, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BillingFeatures() {
    const features = [
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
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
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
    );
}
