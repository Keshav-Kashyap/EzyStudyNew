import { db } from "@/config/db";
import { reviewsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { reviewId, isFeatured } = body;

        if (!reviewId) {
            return NextResponse.json(
                { success: false, error: "Review ID required" },
                { status: 400 }
            );
        }

        await db
            .update(reviewsTable)
            .set({ isFeatured })
            .where(eq(reviewsTable.id, reviewId));

        return NextResponse.json({
            success: true,
            message: "Review updated successfully",
        });

    } catch (error) {
        console.error("Error updating review:", error);

        return NextResponse.json(
            { success: false, error: "Failed to update review" },
            { status: 500 }
        );
    }
}