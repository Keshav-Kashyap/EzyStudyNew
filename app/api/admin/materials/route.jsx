import { db } from "@/config/db";
import { studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { checkAdminAccess } from "@/lib/admin-auth";

// UPDATE material
export async function PUT(request) {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess();
        if (!adminCheck.isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { id, title, description, type, fileUrl, tags } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (type) updateData.type = type;
        if (fileUrl) updateData.fileUrl = fileUrl;
        if (tags !== undefined) updateData.tags = tags;

        // Update the material
        await db
            .update(studyMaterialsTable)
            .set(updateData)
            .where(eq(studyMaterialsTable.id, parseInt(id)));

        return NextResponse.json({
            success: true,
            message: "Material updated successfully",
        });
    } catch (error) {
        console.error("Error updating material:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update material",
            },
            { status: 500 }
        );
    }
}

// DELETE material
export async function DELETE(request) {
    try {
        // Check admin access
        const adminCheck = await checkAdminAccess();
        if (!adminCheck.isAdmin) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const materialId = searchParams.get('id');
        const subjectId = searchParams.get('subjectId'); // Optional: if provided, only remove from this subject

        if (!materialId) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

        // If subjectId is provided, only remove material from that subject
        if (subjectId) {
            // Check how many subjects this material is linked to
            const mappings = await db
                .select()
                .from(materialSubjectMappingTable)
                .where(eq(materialSubjectMappingTable.materialId, parseInt(materialId)));

            if (mappings.length > 1) {
                // Material is shared - only delete the mapping for this subject
                await db
                    .delete(materialSubjectMappingTable)
                    .where(
                        and(
                            eq(materialSubjectMappingTable.materialId, parseInt(materialId)),
                            eq(materialSubjectMappingTable.subjectId, parseInt(subjectId))
                        )
                    );

                return NextResponse.json({
                    success: true,
                    message: "Material removed from this subject (still available in other subjects)",
                    isShared: true
                });
            }
        }

        // Material is not shared or no subjectId provided - delete completely
        // First delete all material-subject mappings
        await db
            .delete(materialSubjectMappingTable)
            .where(eq(materialSubjectMappingTable.materialId, parseInt(materialId)));

        // Then delete the material
        await db
            .delete(studyMaterialsTable)
            .where(eq(studyMaterialsTable.id, parseInt(materialId)));

        return NextResponse.json({
            success: true,
            message: "Material deleted completely",
            isShared: false
        });
    } catch (error) {
        console.error("Error deleting material:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete material",
            },
            { status: 500 }
        );
    }
}
