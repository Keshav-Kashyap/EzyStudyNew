import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from "./_components/AppSidebar"
import WelcomeContainer from './_components/AppWelcomeContainer'
import Navbar from './_components/AppNavbar'
// import MobileNavigation from './dashboard/_components/MobileNavigation'
// import BackgroundLines from '@/components/Background'

const DashboardProvider = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar - Hidden on mobile, collapsed on medium, full on large */}
                <AppSidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 w-full">
                    {/* Fixed Navbar */}
                    <Navbar />

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 w-full">
                        <div className="w-full h-full">
                            <div className="p-4 md:p-6 w-full">
                                <WelcomeContainer />
                            </div>

                            {/* Children Content */}
                            <div className="w-full">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardProvider