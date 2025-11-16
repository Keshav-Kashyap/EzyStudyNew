'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export default function AdminGuard({ children }) {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const pathname = usePathname()
    const [isChecking, setIsChecking] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Don't check if already on 404 or redirecting
        if (pathname === '/404' || pathname === '/not-found') {
            return
        }

        if (isLoaded) {
            if (!user) {
                // Not logged in, redirect to sign in
                router.push('/sign-in')
                return
            }

            // Check admin status only once
            const checkAdmin = async () => {
                try {
                    const res = await fetch('/api/check-admin')
                    const data = await res.json()

                    setIsAdmin(data.isAdmin)
                    setIsChecking(false)

                    if (!data.isAdmin) {
                        // Not admin, redirect to dashboard
                        router.push('/dashboard')
                    }
                } catch (error) {
                    console.error('Admin check failed:', error)
                    setIsChecking(false)
                    router.push('/dashboard')
                }
            }

            checkAdmin()
        }
    }, [isLoaded, user, pathname, router])

    // Show loader while checking
    if (!isLoaded || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
                </div>
            </div>
        )
    }

    // Only show content if user is admin
    if (!isAdmin) {
        return null
    }

    return <>{children}</>
}
