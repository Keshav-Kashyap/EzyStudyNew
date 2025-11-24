"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
    const { user } = useUser();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[rgb(38,38,36)]/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/image.jpeg"
                            alt="Ezy Learn Logo"
                            width={40}
                            height={40}
                            className="rounded-xl"
                        />
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Ezy Learn</h1>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Navigation Links */}
                        <a
                            href="#billing"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('billing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 cursor-pointer"
                        >
                            Billing
                        </a>

                        <a
                            href="#about"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 cursor-pointer"
                        >
                            About
                        </a>

                        {!user ? (
                            <Link href='/sign-in'>
                                <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300">
                                    Login
                                </button>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <UserButton />
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300">
                                    Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
