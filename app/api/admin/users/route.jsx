import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { sql } from '@vercel/postgres'

export async function GET() {
    try {
        const { userId } = auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get all users from database
        const users = await sql`
      SELECT 
        u.id,
        u.user_id as clerk_user_id,
        u.name,
        u.email,
        u.role,
        u.is_active,
        u.created_at,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_enrollments
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      GROUP BY u.id, u.user_id, u.name, u.email, u.role, u.is_active, u.created_at
      ORDER BY u.created_at DESC
    `

        return NextResponse.json(users.rows)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const { userId } = auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, role, isActive } = await request.json()

        // Update user role and status
        const result = await sql`
      UPDATE users 
      SET 
        role = ${role},
        is_active = ${isActive},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            message: 'User updated successfully',
            user: result.rows[0]
        })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}