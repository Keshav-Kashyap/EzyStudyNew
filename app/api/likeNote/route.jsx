// /api/toggleLike/route.js
import { db } from "@/config/db";
import { studyMaterialsTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { id, liked } = await req.json();

        // Update likes count
        await db
            .update(studyMaterialsTable)
            .set({
                likes: liked
                    ? sql`${studyMaterialsTable.likes} + 1`
                    : sql`${studyMaterialsTable.likes} - 1`,
            })
            .where(eq(studyMaterialsTable.id, id));

        // Get updated likes count
        const [material] = await db
            .select({ likes: studyMaterialsTable.likes })
            .from(studyMaterialsTable)
            .where(eq(studyMaterialsTable.id, id));

        // Auto-mark as popular if likes >= 50
        if (material && material.likes >= 50) {
            await db
                .update(studyMaterialsTable)
                .set({ isPopular: true })
                .where(eq(studyMaterialsTable.id, id));
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error updating like:", err);
        return NextResponse.json(
            { error: "Failed to update like" },
            { status: 500 }
        );
    }
}
