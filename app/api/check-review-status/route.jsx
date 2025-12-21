import { db } from "@/config/db";
import { reviewsTable } from "@/config/schema";
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

        // Check if user has submitted any review (using Clerk user ID)
        const userReviews = await db
            .select()
            .from(reviewsTable)
            .where(eq(reviewsTable.userId, user.id))
            .limit(1);

        const hasReviewed = userReviews.length > 0;

        console.log(`[Review Status Check] User: ${user.id}, Has Reviewed: ${hasReviewed}, Reviews Found: ${userReviews.length}`);

        return NextResponse.json({
            success: true,
            hasReviewed: hasReviewed,
            requiresReview: !hasReviewed,
            userId: user.id, // For debugging
            reviewCount: userReviews.length
        });
    } catch (error) {
        console.error("Error checking review status:", error);
        return NextResponse.json(
            { success: false, error: "Failed to check review status" },
            { status: 500 }
        );
    }
}
