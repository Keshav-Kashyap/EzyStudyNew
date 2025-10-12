import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Please login first"
            }, { status: 401 });
        }

        // First, ensure user exists in database
        let dbUser = await db.select()
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        if (dbUser.length === 0) {
            // Create user first
            const newUser = await db.insert(usersTable).values({
                userId: user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
                email: user.emailAddresses?.[0]?.emailAddress || '',
                role: 'student',
                isActive: true,
                credits: 10
            }).returning();

            dbUser = newUser;
            console.log('User created in database');
        }

        // Now make them admin
        const adminUser = await db.update(usersTable)
            .set({
                role: 'admin',
                isActive: true,
                updatedAt: new Date()
            })
            .where(eq(usersTable.userId, user.id))
            .returning();

        console.log('User promoted to admin:', {
            userId: user.id,
            email: user.emailAddresses?.[0]?.emailAddress,
            role: 'admin'
        });

        return NextResponse.json({
            success: true,
            message: "You are now an admin!",
            user: adminUser[0]
        });

    } catch (error) {
        console.error(' Error making user admin:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error
        }, { status: 500 });
    }
}