import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from './config/db'
import { usersTable } from './config/schema'
import { eq } from 'drizzle-orm'

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/',
    '/api/reviews(.*)',
    '/api/popularNotes(.*)',
    '/api/popular-courses(.*)'
])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    if (!isPublicRoute(req)) {
        await auth.protect()
    }

    // Check admin access for admin routes
    if (isAdminRoute(req) && userId) {
        try {
            // Check user role from database
            const dbUser = await db.select()
                .from(usersTable)
                .where(eq(usersTable.userId, userId))
                .limit(1)

            // If user not found or not admin, redirect to dashboard
            if (dbUser.length === 0 || dbUser[0].role !== 'admin' || !dbUser[0].isActive) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }
        } catch (error) {
            console.error('Admin check error:', error)
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}