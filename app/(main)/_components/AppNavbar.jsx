"use client"


import React, { useState } from 'react';
import {
    Search,
    Bell,
    Menu,
    ChevronDown
} from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    return (
        <nav className="w-full h-16 text-white flex items-center justify-between px-6 sticky top-0 z-40" style={{ backgroundColor: 'rgb(38, 38, 36)', borderBottom: '1px solid rgb(50, 50, 48)' }}>

            {/* Left Side - Mobile Menu & Brand */}
            <div className="flex items-center gap-4">
                {/* Mobile Sidebar Toggle */}
                <div className="md:hidden">
                    <SidebarTrigger className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Menu size={20} className="text-white" />
                    </SidebarTrigger>
                </div>

                <h1 className="text-xl font-bold text-white">
                    EduPortal
                </h1>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses, materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: 'rgb(48, 48, 46)', border: '1px solid rgb(60, 60, 58)' }}
                        onFocus={(e) => e.target.style.borderColor = 'rgb(59, 130, 246)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgb(60, 60, 58)'}
                    />
                </div>
            </div>

            {/* Right Side - Notifications & Profile */}
            <div className="flex items-center gap-4">

                {/* Bell Icon */}
                <div className="relative">
                    <button
                        className="p-2 rounded-lg transition-colors relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(48, 48, 46)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <Bell size={20} />
                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">3</span>
                        </span>
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div
                            className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50"
                            style={{ backgroundColor: 'rgb(38, 38, 36)', border: '1px solid rgb(50, 50, 48)' }}
                        >
                            <div className="p-4 border-b" style={{ borderColor: 'rgb(50, 50, 48)' }}>
                                <h3 className="font-semibold text-white">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <div className="p-3 hover:bg-gray-700 cursor-pointer border-b" style={{ borderColor: 'rgb(50, 50, 48)' }}>
                                    <p className="text-sm text-white">New assignment uploaded in MCA Library</p>
                                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                                <div className="p-3 hover:bg-gray-700 cursor-pointer border-b" style={{ borderColor: 'rgb(50, 50, 48)' }}>
                                    <p className="text-sm text-white">Your billing cycle ends in 3 days</p>
                                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                                </div>
                                <div className="p-3 hover:bg-gray-700 cursor-pointer">
                                    <p className="text-sm text-white">Welcome to EduPortal!</p>
                                    <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 p-2 rounded-lg transition-colors"
                        onClick={() => setShowProfile(!showProfile)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(48, 48, 46)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">A</span>
                        </div>
                        <span className="text-sm font-medium text-gray-200">Admin</span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div
                            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
                            style={{ backgroundColor: 'rgb(38, 38, 36)', border: '1px solid rgb(50, 50, 48)' }}
                        >
                            <div className="p-4 border-b" style={{ borderColor: 'rgb(50, 50, 48)' }}>
                                <p className="font-semibold text-white">Admin User</p>
                                <p className="text-xs text-gray-400">admin@eduportal.com</p>
                            </div>
                            <div className="py-2">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                                    Profile Settings
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                                    Account Settings
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                                    Help & Support
                                </button>
                                <hr className="my-2" style={{ borderColor: 'rgb(50, 50, 48)' }} />
                                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors">
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