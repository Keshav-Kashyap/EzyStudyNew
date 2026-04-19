import { db } from "@/config/db";
import { reviewsTable } from "@/config/schema";
import { checkAdminAccess } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
    try {
        const adminCheck = await checkAdminAccess();
        if (!adminCheck.isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 403 }
            );
        }

        const reviews = await db
            .select()
            .from(reviewsTable)
            .where(eq(reviewsTable.isFeatured, true))
            .orderBy(desc(reviewsTable.createdAt))
            .limit(50);

        return NextResponse.json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Error fetching featured reviews:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch featured reviews" },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const adminCheck = await checkAdminAccess();
        if (!adminCheck.isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const reviewId = parseInt(body.reviewId, 10);
        const isFeatured = Boolean(body.isFeatured);

        if (!reviewId) {
            return NextResponse.json(
                { success: false, error: "Review ID is required" },
                { status: 400 }
            );
        }

        const updatedReviews = await db
            .update(reviewsTable)
            .set({
                isFeatured,
            })
            .where(eq(reviewsTable.id, reviewId))
            .returning();

        if (!updatedReviews.length) {
            return NextResponse.json(
                { success: false, error: "Review not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Review ${isFeatured ? "featured" : "unfeatured"} successfully`,
            review: updatedReviews[0],
        });
    } catch (error) {
        console.error("Error updating featured review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update featured review" },
            { status: 500 }
        );
    }
}
