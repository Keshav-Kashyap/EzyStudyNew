import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Not logged in"
            }, { status: 401 });
        }

        // Check user in database
        const dbUser = await db.select()
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        if (dbUser.length === 0) {
            return NextResponse.json({
                success: false,
                error: "User not found in database",
                clerkId: user.id,
                email: user.emailAddresses?.[0]?.emailAddress
            });
        }

        const userRecord = dbUser[0];

        return NextResponse.json({
            success: true,
            user: {
                id: userRecord.id,
                name: userRecord.name,
                email: userRecord.email,
                role: userRecord.role,
                isActive: userRecord.isActive,
                clerkId: user.id
            },
            isAdmin: userRecord.role === 'admin' && userRecord.isActive
        });

    } catch (error) {
        console.error('Error checking user role:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// Make user admin (for testing/setup)
export async function POST(request) {
    try {
        const { userId, makeAdmin } = await request.json();

        if (!userId) {
            return NextResponse.json({
                success: false,
                error: "User ID required"
            }, { status: 400 });
        }

        // Update user role
        const result = await db
            .update(usersTable)
            .set({ role: makeAdmin ? 'admin' : 'student' })
            .where(eq(usersTable.userId, userId))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({
                success: false,
                error: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User ${makeAdmin ? 'promoted to admin' : 'demoted to student'}`,
            user: result[0]
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
