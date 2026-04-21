"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import AppSidebar from "./_components/AppSidebar"
import WelcomeContainer from './_components/AppWelcomeContainer'
import Navbar from './_components/AppNavbar'
import GPTSidebar from '@/components/GPTSidebar'
// import MobileNavigation from './dashboard/_components/MobileNavigation'
// import BackgroundLines from '@/components/Background'
import { menuItems, bottomMenuItems } from '../../services/constant'

const DashboardProvider = ({ children }) => {
    const [aiSidebarOpen, setAISidebarOpen] = useState(false);
    const [aiMessages, setAIMessages] = useState([]);
    const [sidebarWidth, setSidebarWidth] = useState(680);

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <AppSidebar menuItems={menuItems} bottomMenuItems={bottomMenuItems} isAdmin={false} />

                {/* Main Content Area */}
                <div
                    className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-[rgb(38,38,36)]"
                    style={{
                        marginRight: aiSidebarOpen ? `${sidebarWidth}px` : '0',
                        transition: 'margin-right 0.1s ease-out'
                    }}
                >
                    {/* Fixed Navbar */}
                    <Navbar onOpenAI={() => setAISidebarOpen(true)} />

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto bg-white dark:bg-[rgb(38,38,36)]">
                        <div className="w-full">


                            {/* Children Content */}
                            <div className="w-full px-4 md:px-6 pb-6">
                                {children}
                            </div>
                        </div>
                    </main>


                </div>
            </div>

            {/* AI Sidebar */}
            <GPTSidebar
                open={aiSidebarOpen}
                onClose={() => setAISidebarOpen(false)}
                messages={aiMessages}
                onWidthChange={setSidebarWidth}
            />
        </SidebarProvider>
    )
}

export default DashboardProvider