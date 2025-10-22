// /api/toggleLike/route.js
import { db } from "@/config/db";
import { studyMaterialsTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { id, liked } = await req.json();

        await db
            .update(studyMaterialsTable)
            .set({
                likes: liked
                    ? sql`${studyMaterialsTable.likes} + 1`
                    : sql`${studyMaterialsTable.likes} - 1`,
            })
            .where(eq(studyMaterialsTable.id, id));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error updating like:", err);
        return NextResponse.json(
            { error: "Failed to update like" },
            { status: 500 }
        );
    }
}
