"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
    Search,
    Bell,
    Menu,
    ChevronDown,
    Sun,
    Moon
} from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Ensure component is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.notification-dropdown')) {
                setShowNotifications(false);
            }
            if (!event.target.closest('.profile-dropdown')) {
                setShowProfile(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return null; // Prevent SSR mismatch
    }

    return (
        <nav className="w-full h-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-between px-6 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">

            {/* Left Side - Mobile Menu & Brand */}
            <div className="flex items-center gap-4">
                {/* Mobile Sidebar Toggle */}
                <div className="md:hidden">
                    <SidebarTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Menu size={20} className="text-gray-900 dark:text-white" />
                    </SidebarTrigger>
                </div>

                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    EduPortal
                </h1>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses, materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Right Side - Theme Toggle, Notifications & Profile */}
            <div className="flex items-center gap-2">

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun size={20} className="text-yellow-500" />
                    ) : (
                        <Moon size={20} className="text-gray-600" />
                    )}
                </button>

                {/* Bell Icon */}
                <div className="relative notification-dropdown">
                    <button
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">3</span>
                        </span>
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-sm text-gray-900 dark:text-white">New assignment uploaded in MCA Library</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                                </div>
                                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-sm text-gray-900 dark:text-white">Your billing cycle ends in 3 days</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 day ago</p>
                                </div>
                                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                    <p className="text-sm text-gray-900 dark:text-white">Welcome to EduPortal!</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative profile-dropdown">
                    <button
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">A</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <p className="font-semibold text-gray-900 dark:text-white">Admin User</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">admin@eduportal.com</p>
                            </div>
                            <div className="py-2">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Profile Settings
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Account Settings
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Help & Support
                                </button>
                                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                <button className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;