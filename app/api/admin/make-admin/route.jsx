import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(request) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Please login first"
            }, { status: 401 });
        }

        const { email } = await request.json();

        // Make user admin by email
        const result = await db.update(usersTable)
            .set({
                role: 'admin',
                isActive: true,
                updatedAt: new Date()
            })
            .where(eq(usersTable.email, email))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({
                success: false,
                error: "User not found with this email"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User ${email} is now an admin!`,
            user: result[0]
        });

    } catch (error) {
        console.error('Error making user admin:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}