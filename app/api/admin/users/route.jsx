import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { usersTable, enrollmentsTable } from '@/config/schema'
import { sql, desc, eq, count } from 'drizzle-orm'

export async function GET() {
    try {
        const user = await currentUser()
        const userId = user?.id

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get all users from database using Drizzle
        const users = await db.select({
            id: usersTable.id,
            clerkUserId: usersTable.userId,
            name: usersTable.name,
            email: usersTable.email,
            role: usersTable.role,
            status: usersTable.isActive,
            createdAt: usersTable.createdAt,
        })
            .from(usersTable)
            .orderBy(desc(usersTable.createdAt))

        // Transform data to match expected format
        const transformedUsers = users.map(user => ({
            id: user.id,
            clerkUserId: user.clerkUserId,
            name: user.name,
            email: user.email,
            role: user.role || 'student',
            status: user.status ? 'active' : 'inactive',
            createdAt: user.createdAt,
            activeEnrollments: 0
        }))

        return NextResponse.json({
            success: true,
            users: transformedUsers
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const user = await currentUser()
        const userId = user?.id

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, role, isActive } = await request.json()

        // Update user role and status using Drizzle
        const result = await db.update(usersTable)
            .set({
                role: role,
                isActive: isActive,
                updatedAt: new Date()
            })
            .where(eq(usersTable.id, id))
            .returning()

        if (result.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: result[0]
        })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}