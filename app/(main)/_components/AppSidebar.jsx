"use client"

import React, { useState } from 'react';
import {
    BookOpen,
    Settings,
    CreditCard,
    Users,
    Menu,
    ChevronLeft,
    ChevronRight,
    Code,
    Database,
    Cpu,
    GraduationCap,
    Home,
    User,
    LogOut,
    Bell
} from 'lucide-react';

const AppSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: Home,
            href: '/dashboard',
            isActive: true
        },
        {
            title: 'MCA Library',
            icon: Code,
            href: '/mca-library'
        },
        {
            title: 'BCA Library',
            icon: Database,
            href: '/bca-library'
        },
        {
            title: 'B.Tech Library',
            icon: Cpu,
            href: '/btech-library'
        },
        {
            title: 'General Library',
            icon: BookOpen,
            href: '/general-library'
        },
        {
            title: 'Study Materials',
            icon: GraduationCap,
            href: '/study-materials'
        }
    ];

    const bottomMenuItems = [
        {
            title: 'Notifications',
            icon: Bell,
            href: '/notifications',
            badge: 3
        },
        {
            title: 'Settings',
            icon: Settings,
            href: '/settings'
        },
        {
            title: 'Billing',
            icon: CreditCard,
            href: '/billing'
        },
        {
            title: 'Join Us',
            icon: Users,
            href: '/join-us'
        }
    ];

    return (
        <div className={`
            hidden md:flex 
            ${isCollapsed ? 'w-20' : 'w-72'} 
            bg-white dark:bg-[rgb(38,38,36)] 
            border-r border-gray-200 dark:border-[rgb(50,50,48)] 
            text-gray-900 dark:text-white 
            transition-all duration-300 flex-col min-h-screen
            relative shadow-xl
        `}>

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-[rgb(50,50,48)] flex-shrink-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                EduPortal
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Learning Hub</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`
                        p-2.5 rounded-xl transition-all duration-200 
                        hover:bg-gray-100 dark:hover:bg-[rgb(48,48,46)] hover:shadow-lg
                        ${isCollapsed ? 'mx-auto' : ''}
                    `}
                >
                    {isCollapsed ? (
                        <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                    ) : (
                        <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    )}
                </button>
            </div>

            {/* Main Navigation - Scrollable */}
            <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="space-y-2">
                    {!isCollapsed && (
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Main Menu
                            </p>
                        </div>
                    )}

                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                                w-full flex items-center gap-4 px-4 py-3 rounded-xl 
                                transition-all duration-300 group relative overflow-hidden
                                ${item.isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20 text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-[rgb(48,48,46)] hover:shadow-lg'
                                }
                                ${isCollapsed ? 'justify-center' : ''}
                                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
                                before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700
                            `}
                            title={isCollapsed ? item.title : ''}
                        >
                            <item.icon
                                size={22}
                                className={`
                                    flex-shrink-0 transition-all duration-300
                                    ${item.isActive
                                        ? 'text-white drop-shadow-sm'
                                        : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:scale-110'
                                    }
                                `}
                            />

                            {!isCollapsed && (
                                <>
                                    <span className={`
                                        text-sm font-medium transition-all duration-300
                                        ${item.isActive
                                            ? 'text-white drop-shadow-sm'
                                            : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1'
                                        }
                                    `}>
                                        {item.title}
                                    </span>

                                    {item.isActive && (
                                        <div className="absolute right-3">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                    {item.title}
                                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Bottom Menu - Sticky */}
            <div className="p-4 border-t border-gray-200 dark:border-[rgb(50,50,48)] flex-shrink-0">
                <div className="space-y-2">
                    {!isCollapsed && (
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Account
                            </p>
                        </div>
                    )}

                    {bottomMenuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                                w-full flex items-center gap-4 px-4 py-3 rounded-xl 
                                transition-all duration-300 group relative overflow-hidden
                                hover:bg-gray-100 dark:hover:bg-[rgb(48,48,46)] hover:shadow-lg
                                ${isCollapsed ? 'justify-center' : ''}
                                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 dark:before:via-white/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700
                            `}
                            title={isCollapsed ? item.title : ''}
                        >
                            <div className="relative">
                                <item.icon
                                    size={20}
                                    className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-all duration-300 flex-shrink-0 group-hover:scale-110"
                                />
                                {item.badge && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                        <span className="text-xs text-white font-bold">{item.badge}</span>
                                    </div>
                                )}
                            </div>

                            {!isCollapsed && (
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                                    {item.title}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                    {item.title}
                                    {item.badge && (
                                        <span className="ml-2 px-2 py-1 bg-red-500 text-xs rounded-full animate-pulse">{item.badge}</span>
                                    )}
                                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Profile - Sticky */}
            <div className="p-4 border-t border-gray-200 dark:border-[rgb(50,50,48)] flex-shrink-0">
                {!isCollapsed ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[rgb(48,48,46)] transition-all duration-300 cursor-pointer group relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 dark:before:via-white/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[rgb(38,38,36)] animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                                Admin User
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                admin@eduportal.com
                            </div>
                        </div>
                        <LogOut size={18} className="text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            className="relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[rgb(48,48,46)] transition-all duration-300 group overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 dark:before:via-white/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700"
                            title="Admin User"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[rgb(38,38,36)] animate-pulse"></div>

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                Admin User
                                <div className="text-xs text-gray-300">admin@eduportal.com</div>
                                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background-color: rgb(209 213 219);
                    border-radius: 2px;
                }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb {
                    background-color: rgb(75 85 99);
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(156 163 175);
                }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(107 114 128);
                }
            `}</style>
        </div>
    );
};

export default AppSidebar;