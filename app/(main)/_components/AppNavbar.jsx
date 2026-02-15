"use client"

import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from 'next-themes';
import GlobalSearchDialog from './GlobalSearchDialog';

import {
    Search,
    Bell,
    Menu,
    ChevronDown,
    Sun,
    Moon,
    Sparkles
} from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { UserButton, useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Skeleton } from '@/components/ui/skeleton';


const Navbar = ({ onOpenAI }) => {
    const { userDetail } = useContext(UserDetailContext);
    const { setOpen } = useSidebar(); // Sidebar control ke liye

    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSearchDialog, setShowSearchDialog] = useState(false);
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

    // Navbar se hamesha full sidebar open karne ke liye
    const handleMenuClick = () => {
        setOpen(true); // Hamesha full sidebar khulega
    };

    if (!mounted) {
        return null; // Prevent SSR mismatch
    }

    return (
        <nav className="w-full h-16 bg-white dark:bg-[rgb(38,38,36)] text-gray-900 dark:text-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">

            {/* Left Side - Mobile Menu & Brand */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Sidebar Toggle - Ab SidebarTrigger ki jagah custom button */}
                <div className="md:hidden">

                    <SidebarTrigger onClick={handleMenuClick} className="w-10 h-10  rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-gray-100 dark:hover:bg-[rgb(45,45,44)] transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white  hover:cursor-w-resize" >
                        <Menu size={5} />
                    </SidebarTrigger>
                </div>

                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    EzyLearn
                </h1>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-[120px] md:max-w-md mx-2 md:mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onFocus={() => setShowSearchDialog(true)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-2 rounded-lg bg-gray-50 dark:bg-[#30302E] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm cursor-pointer"
                        readOnly
                    />
                </div>
            </div>

            {/* Global Search Dialog */}
            <GlobalSearchDialog
                isOpen={showSearchDialog}
                onClose={() => setShowSearchDialog(false)}
            />

            {/* Right Side - AI, Theme Toggle, Notifications & Profile */}
            <div className="flex items-center gap-1 md:gap-2">

                {/* AI Button */}
                <button
                    onClick={onOpenAI}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                    aria-label="Open AI Assistant"
                    title="Chat with AI"
                >
                    <Sparkles size={20} className="text-white" />
                </button>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[rgb(45,45,44)] transition-colors duration-300 ease-in-out"
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
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[rgb(45,45,44)] transition-colors duration-300 ease-in-out relative"
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
                        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[rgb(24,24,24)] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ease-in-out">
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
                                    <p className="text-sm text-gray-900 dark:text-white">Welcome to EzyLearn!</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative profile-dropdown">
                    <button
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[rgb(45,45,44)] transition-colors duration-300 ease-in-out"
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <UserButton
                            appearance={{
                                baseTheme: undefined,
                                elements: {
                                    avatarBox: "border-2 border-transparent",
                                },
                                variables: {
                                    colorPrimary: "black",   // default for light mode
                                },
                            }}
                            afterSignOutUrl="/"
                        />

                        {/* Name hidden on mobile, visible on md and up */}
                        {userDetail === undefined ? (
                            <div className="hidden md:block">
                                <Skeleton className="h-4 w-20 rounded-md" />
                            </div>
                        ) : (
                            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {userDetail?.name}
                            </span>
                        )}
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;