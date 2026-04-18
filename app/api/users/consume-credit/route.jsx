import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST() {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const updatedUsers = await db
            .update(usersTable)
            .set({
                credits: sql`COALESCE(${usersTable.credits}, 10) - 1`,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(usersTable.userId, user.id),
                    or(isNull(usersTable.credits), gt(usersTable.credits, 0))
                )
            )
            .returning();

        if (updatedUsers.length === 0) {
            const existingUser = await db
                .select({ id: usersTable.id, credits: usersTable.credits })
                .from(usersTable)
                .where(eq(usersTable.userId, user.id))
                .limit(1);

            if (existingUser.length === 0) {
                return NextResponse.json(
                    { success: false, error: "User not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: "Not enough credits to download",
                    credits: existingUser[0].credits ?? 0,
                },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Credit deducted successfully",
            user: updatedUsers[0],
        });
    } catch (error) {
        console.error("Error deducting credit:", error);
        return NextResponse.json(
            { success: false, error: "Failed to deduct credit" },
            { status: 500 }
        );
    }
}