import { db } from "@/config/db";
import { reviewsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
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

export async function POST(req) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { rating, reviewText, userName, userEmail } = body;

        if (!rating || !reviewText) {
            return NextResponse.json(
                { success: false, error: "Rating and review text are required" },
                { status: 400 }
            );
        }

        // Insert the review (user can submit multiple reviews)
        const newReview = await db
            .insert(reviewsTable)
            .values({
                userId: user.id,
                userName: userName || user.firstName || 'Anonymous',
                userEmail: userEmail || user.emailAddresses?.[0]?.emailAddress,
                rating: rating,
                reviewText: reviewText.trim(),
                createdAt: new Date()
            })
            .returning();

        // Update user's hasReviewed flag to true (only on first review)
        await db
            .update(usersTable)
            .set({ hasReviewed: true })
            .where(eq(usersTable.userId, user.id));

        console.log(`[Review Submitted] User: ${user.id}, Name: ${userName}, Rating: ${rating}`);

        return NextResponse.json({
            success: true,
            review: newReview[0],
            message: "Review submitted successfully"
        });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit review" },
            { status: 500 }
        );
    }
}
