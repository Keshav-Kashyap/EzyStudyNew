import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from "./_components/AppSidebar"
import WelcomeContainer from './_components/AppWelcomeContainer'
import Navbar from './_components/AppNavbar'
// import MobileNavigation from './dashboard/_components/MobileNavigation'
// import BackgroundLines from '@/components/Background'
import { menuItems, bottomMenuItems } from '../../services/constant'

const DashboardProvider = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <AppSidebar menuItems={menuItems} bottomMenuItems={bottomMenuItems} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-[rgb(38,38,36)]">
                    {/* Fixed Navbar */}
                    <Navbar />

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto bg-white dark:bg-[rgb(38,38,36)]">
                        <div className="w-full h-full">
                            <div className="p-4 md:p-6 w-full">
                                <WelcomeContainer />
                            </div>

                            {/* Children Content */}
                            <div className="w-full px-4 md:px-6 pb-6">
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