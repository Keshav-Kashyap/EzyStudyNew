import React from 'react'
import DashboardProvider from './provider';

const AdminLayout = ({ children }) => {
    return (
        <DashboardProvider>
            {children}
        </DashboardProvider>
    )
}

export default AdminLayout;