import { Users, Code, Rocket, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProjectStatsSection() {
    const stats = [
        { icon: Users, label: "Team Members", value: "4+", gradient: "from-blue-500 to-cyan-500" },
        { icon: Code, label: "Projects", value: "10+", gradient: "from-purple-500 to-pink-500" },
        { icon: Rocket, label: "Students Helped", value: "1000+", gradient: "from-yellow-500 to-orange-500" },
        { icon: Heart, label: "Happy Users", value: "95%", gradient: "from-green-500 to-emerald-500" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
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
    );
}
