import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from "../(main)/_components/AppSidebar"
import { adminMenuItems, adminbottomMenuItems } from '@/services/constant'

const DashboardProvider = ({ children }) => {
    return (
        <SidebarProvider>



            <div className="flex h-screen w-full  overflow-hidden">
                {/* Sidebar - Hidden on mobile, collapsed on medium, full on large */}



                <AppSidebar menuItems={adminMenuItems} bottomMenuItems={adminbottomMenuItems} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 w-full">

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto bg-white dark:bg-[rgb(38,38,36)] w-full">
                        <div className="w-full h-full">


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