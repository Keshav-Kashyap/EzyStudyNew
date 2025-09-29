import React from 'react'
import DashboardProvider from './provider';

const AdminLayout = ({ children }) => {
    return (
        <DashboardProvider>
            <div>
                {children}
            </div>
        </DashboardProvider>
    )
}

export default AdminLayout;