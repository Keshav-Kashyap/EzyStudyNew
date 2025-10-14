import React from 'react'
import DashboardProvider from './provider';
import Navbar from '../(main)/_components/AppNavbar';

const AdminLayout = ({ children }) => {
    return (
        <DashboardProvider>

            <Navbar />
            <div>
                {children}
            </div>
        </DashboardProvider>
    )
}

export default AdminLayout;