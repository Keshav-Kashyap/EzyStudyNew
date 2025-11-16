import { db } from "@/config/db";
import { studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { checkAdminAccess } from "@/lib/admin-auth";

export async function POST(request) {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess();
        if (!adminCheck.isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 403 }
            );
        }

        const { materialId, isPopular } = await request.json();

        if (!materialId) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

        // Update material popularity
        const result = await db
            .update(studyMaterialsTable)
            .set({ isPopular: isPopular })
            .where(eq(studyMaterialsTable.id, parseInt(materialId)))
            .returning();

        if (!result || result.length === 0) {
            throw new Error('Material not found or update failed');
        }

        return NextResponse.json({
            success: true,
            message: `Material ${isPopular ? 'marked' : 'unmarked'} as popular`,
            isPopular
        });
    } catch (error) {
        console.error("Error toggling popular status:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update popular status",
            },
            { status: 500 }
        );
    }
}
