import { db } from "@/config/db";
import { downloadsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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
        const { materialId } = body;

        if (!materialId) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

        // Get user's database ID
        const userRecord = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.userId, user.id))
            .limit(1);

        if (userRecord.length === 0) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Track download
        await db.insert(downloadsTable).values({
            userId: userRecord[0].id,
            materialId: materialId,
            downloadedAt: new Date()
        });

        // Get total download count
        const downloads = await db
            .select()
            .from(downloadsTable)
            .where(eq(downloadsTable.userId, userRecord[0].id));

        console.log(`[Download Tracked] User: ${user.id}, Material: ${materialId}, Total Downloads: ${downloads.length}`);

        return NextResponse.json({
            success: true,
            downloadCount: downloads.length,
            message: "Download tracked successfully"
        });
    } catch (error) {
        console.error("Error tracking download:", error);
        return NextResponse.json(
            { success: false, error: "Failed to track download" },
            { status: 500 }
        );
    }
}
