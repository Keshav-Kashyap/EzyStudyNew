import { db } from "@/config/db";
import { usersTable, downloadsTable } from "@/config/schema";
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
                requiresReview: false,
                downloadCount: 0
            });
        }

        // Get user record to check hasReviewed flag
        const userRecord = await db
            .select({
                id: usersTable.id,
                hasReviewed: usersTable.hasReviewed
            })
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        if (userRecord.length === 0) {
            // User not registered yet
            return NextResponse.json({
                success: true,
                hasReviewed: false,
                requiresReview: false,
                downloadCount: 0
            });
        }

        const hasReviewed = userRecord[0].hasReviewed;

        // If already reviewed, no need to count downloads
        if (hasReviewed) {
            return NextResponse.json({
                success: true,
                hasReviewed: true,
                requiresReview: false,
                downloadCount: 0
            });
        }

        // Count total downloads for this user
        const downloadCount = await db
            .select()
            .from(downloadsTable)
            .where(eq(downloadsTable.userId, userRecord[0].id));

        const totalDownloads = downloadCount.length;

        // Require review after 2 downloads
        const requiresReview = totalDownloads >= 2 && !hasReviewed;

        console.log(`[Review Status] User: ${user.id}, Downloads: ${totalDownloads}, Has Reviewed: ${hasReviewed}, Requires Review: ${requiresReview}`);

        return NextResponse.json({
            success: true,
            hasReviewed: hasReviewed,
            requiresReview: requiresReview,
            downloadCount: totalDownloads,
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
