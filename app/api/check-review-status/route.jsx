import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({
                success: true,
                hasReviewed: false,
                requiresReview: true
            });
        }

        // Check hasReviewed flag from users table (fast lookup)
        const userRecord = await db
            .select({ hasReviewed: usersTable.hasReviewed })
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        const hasReviewed = userRecord.length > 0 ? userRecord[0].hasReviewed : false;

        console.log(`[Review Status Check] User: ${user.id}, Has Reviewed: ${hasReviewed}`);

        return NextResponse.json({
            success: true,
            hasReviewed: hasReviewed,
            requiresReview: !hasReviewed,
            userId: user.id
        });
    } catch (error) {
        console.error("Error checking review status:", error);
        return NextResponse.json(
            { success: false, error: "Failed to check review status" },
            { status: 500 }
        );
    }
}
