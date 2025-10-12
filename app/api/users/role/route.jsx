import { NextResponse } from "next/server";
import { db } from "../../../../config/db.jsx";
import { usersTable } from "../../../../config/schema.jsx";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Not logged in",
                isAuthenticated: false,
                isAdmin: false
            });
        }

        // Check database for user role
        const dbUser = await db.select()
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        if (dbUser.length === 0) {
            // Create user if doesn't exist
            try {
                const newUser = await db.insert(usersTable).values({
                    userId: user.id,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                    email: user.emailAddresses?.[0]?.emailAddress || '',
                    role: 'student',
                    isActive: true
                }).returning();

                return NextResponse.json({
                    success: true,
                    isAuthenticated: true,
                    isAdmin: false,
                    user: newUser[0],
                    message: "New user created"
                });
            } catch (createError) {
                console.error('Error creating user:', createError);
                return NextResponse.json({
                    success: false,
                    error: "Failed to create user",
                    isAuthenticated: true,
                    isAdmin: false
                });
            }
        }

        const userRecord = dbUser[0];
        const isAdmin = userRecord.role === 'admin' && userRecord.isActive;

        return NextResponse.json({
            success: true,
            isAuthenticated: true,
            isAdmin: isAdmin,
            user: userRecord
        });

    } catch (error) {
        console.error(' Role check error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            isAuthenticated: false,
            isAdmin: false
        }, { status: 500 });
    }
}