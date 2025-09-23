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
            bg-[rgb(38,38,36)] border-r border-[rgb(50,50,48)] 
            text-white transition-all duration-300 flex-col min-h-screen
            relative shadow-xl
        `}>

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-[rgb(50,50,48)]">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                EduPortal
                            </h1>
                            <p className="text-xs text-gray-400">Learning Hub</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`
                        p-2.5 rounded-xl transition-all duration-200 
                        hover:bg-[rgb(48,48,46)] hover:shadow-lg
                        ${isCollapsed ? 'mx-auto' : ''}
                    `}
                >
                    {isCollapsed ? (
                        <ChevronRight size={20} className="text-gray-300" />
                    ) : (
                        <ChevronLeft size={20} className="text-gray-300" />
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {!isCollapsed && (
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Main Menu
                            </p>
                        </div>
                    )}

                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                                w-full flex items-center gap-4 px-4 py-3 rounded-xl 
                                transition-all duration-200 group relative
                                ${item.isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20 text-white'
                                    : 'hover:bg-[rgb(48,48,46)] hover:shadow-lg'
                                }
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                            title={isCollapsed ? item.title : ''}
                        >
                            <item.icon
                                size={22}
                                className={`
                                    flex-shrink-0 transition-colors
                                    ${item.isActive
                                        ? 'text-white'
                                        : 'text-blue-400 group-hover:text-blue-300'
                                    }
                                `}
                            />

                            {!isCollapsed && (
                                <>
                                    <span className={`
                                        text-sm font-medium transition-colors
                                        ${item.isActive
                                            ? 'text-white'
                                            : 'text-gray-200 group-hover:text-white'
                                        }
                                    `}>
                                        {item.title}
                                    </span>

                                    {item.isActive && (
                                        <div className="absolute right-3">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                    {item.title}
                                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Bottom Menu */}
            <div className="p-4 border-t border-[rgb(50,50,48)]">
                <div className="space-y-2">
                    {!isCollapsed && (
                        <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Account
                            </p>
                        </div>
                    )}

                    {bottomMenuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`
                                w-full flex items-center gap-4 px-4 py-3 rounded-xl 
                                transition-all duration-200 group relative
                                hover:bg-[rgb(48,48,46)] hover:shadow-lg
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                            title={isCollapsed ? item.title : ''}
                        >
                            <div className="relative">
                                <item.icon
                                    size={20}
                                    className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0"
                                />
                                {item.badge && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">{item.badge}</span>
                                    </div>
                                )}
                            </div>

                            {!isCollapsed && (
                                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                                    {item.title}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                    {item.title}
                                    {item.badge && (
                                        <span className="ml-2 px-2 py-1 bg-red-500 text-xs rounded-full">{item.badge}</span>
                                    )}
                                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-[rgb(50,50,48)]">
                {!isCollapsed ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgb(48,48,46)] transition-colors cursor-pointer group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[rgb(38,38,36)]"></div>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                                Admin User
                            </div>
                            <div className="text-xs text-gray-400">
                                admin@eduportal.com
                            </div>
                        </div>
                        <LogOut size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            className="relative p-3 rounded-xl hover:bg-[rgb(48,48,46)] transition-colors group"
                            title="Admin User"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[rgb(38,38,36)]"></div>

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                Admin User
                                <div className="text-xs text-gray-300">admin@eduportal.com</div>
                                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppSidebar;