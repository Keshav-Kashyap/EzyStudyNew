import { db } from "@/config/db";
import { materialSubjectMappingTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

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
        const { mappingId, subjectId, isPinned } = body;

        if (!mappingId || !subjectId) {
            return NextResponse.json(
                { success: false, error: "Mapping ID and Subject ID are required" },
                { status: 400 }
            );
        }

        // If pinning, check if already 3 pinned materials in this subject
        if (isPinned) {
            const pinnedMaterials = await db
                .select()
                .from(materialSubjectMappingTable)
                .where(
                    and(
                        eq(materialSubjectMappingTable.subjectId, subjectId),
                        eq(materialSubjectMappingTable.isPinned, true)
                    )
                );

            if (pinnedMaterials.length >= 3) {
                return NextResponse.json(
                    { success: false, error: "Maximum 3 materials can be pinned per subject" },
                    { status: 400 }
                );
            }
        }

        // Update the mapping
        await db
            .update(materialSubjectMappingTable)
            .set({
                isPinned: isPinned,
                pinnedAt: isPinned ? new Date() : null
            })
            .where(eq(materialSubjectMappingTable.id, mappingId));

        return NextResponse.json({
            success: true,
            message: isPinned ? "Material pinned successfully" : "Material unpinned successfully"
        });
    } catch (error) {
        console.error("Error toggling pin:", error);
        return NextResponse.json(
            { success: false, error: "Failed to toggle pin" },
            { status: 500 }
        );
    }
}
