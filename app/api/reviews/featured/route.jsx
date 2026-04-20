import { db } from "@/config/db";
import { reviewsTable, usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
    try {
        const reviews = await db
            .select({
                id: reviewsTable.id,
                userId: reviewsTable.userId,
                userName: reviewsTable.userName,
                userEmail: reviewsTable.userEmail,
                rating: reviewsTable.rating,
                reviewText: reviewsTable.reviewText,
                isApproved: reviewsTable.isApproved,
                isFeatured: reviewsTable.isFeatured,
                createdAt: reviewsTable.createdAt,
                image: usersTable.image
            })
            .from(reviewsTable)
            .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.userId))
            .where(eq(reviewsTable.isFeatured, true))
            .orderBy(desc(reviewsTable.createdAt))
            .limit(50);

        return NextResponse.json({
            success: true,
            reviews: reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}


