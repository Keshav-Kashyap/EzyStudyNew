import { Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function TeamSection() {
    const teamMember = {
        name: "Keshav Kashyap",
        role: "Full Stack Developer & Founder",
        photo: "/keshav.jpeg",
        banner: "/banner.jpg",
        github: "https://github.com/Keshav-Kashyap",
        linkedin: "https://www.linkedin.com/in/keshav-kashyap-660a23309",
        instagram: "https://www.instagram.com/keshav_9058?igsh=NjFtOTh6aWtndG11",
        bio: "Passionate about building scalable web applications and transforming education through technology"
    };

    return (
        <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-3 flex items-center justify-center gap-3">
                <Brain className="w-10 h-10 text-purple-500" />
                Brilliant Mind Behind Ezy Learn
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Meet the passionate innovator dedicated to transforming education and empowering students worldwide
            </p>

            <div className="flex justify-center">
                <Card className="w-full max-w-lg border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white dark:bg-[rgb(38,38,36)] overflow-hidden">
                    {/* Banner Image */}
                    <div className="h-32 relative">
                        <Image
                            src={teamMember.banner}
                            alt="Banner"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <CardHeader className="text-center -mt-16 relative z-10">
                        <div className="w-32 h-32 mx-auto rounded-full border-4 border-white dark:border-[rgb(38,38,36)] shadow-xl overflow-hidden mb-4">
                            <Image
                                src={teamMember.photo}
                                alt={teamMember.name}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {teamMember.name}
                        </CardTitle>
                        <CardDescription className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                            {teamMember.role}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="text-center space-y-6">
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            {teamMember.bio}
                        </p>

                        {/* Social Links */}
                        <div className="flex justify-center gap-4">
                            <a
                                href={teamMember.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[rgb(45,45,44)] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[rgb(55,55,54)] transition-colors hover:scale-110"
                            >
                                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            </a>
                            <a
                                href={teamMember.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors hover:scale-110"
                            >
                                <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </a>
                            <a
                                href={teamMember.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors hover:scale-110"
                            >
                                <Instagram className="w-6 h-6 text-white" />
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
