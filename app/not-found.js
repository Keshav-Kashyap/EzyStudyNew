'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                        The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>
                        <Button asChild className="gap-2">
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
