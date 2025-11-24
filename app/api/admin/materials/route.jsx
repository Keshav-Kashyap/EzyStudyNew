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
        const subjectId = searchParams.get('subjectId'); // Required: always remove from specific subject only

        if (!materialId) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

        if (!subjectId) {
            return NextResponse.json(
                { success: false, error: "Subject ID is required. Materials can only be removed from specific subjects." },
                { status: 400 }
            );
        }

        // Check how many subjects this material is linked to
        const mappings = await db
            .select()
            .from(materialSubjectMappingTable)
            .where(eq(materialSubjectMappingTable.materialId, parseInt(materialId)));

        if (mappings.length === 0) {
            return NextResponse.json(
                { success: false, error: "Material not found in any subject" },
                { status: 404 }
            );
        }

        // Always only delete the mapping for this subject (never delete the material itself)
        await db
            .delete(materialSubjectMappingTable)
            .where(
                and(
                    eq(materialSubjectMappingTable.materialId, parseInt(materialId)),
                    eq(materialSubjectMappingTable.subjectId, parseInt(subjectId))
                )
            );

        const remainingCount = mappings.length - 1;

        return NextResponse.json({
            success: true,
            message: remainingCount > 0
                ? `Material removed from this subject (still available in ${remainingCount} other subject${remainingCount > 1 ? 's' : ''})`
                : "Material removed from this subject",
            isShared: remainingCount > 0,
            remainingSubjects: remainingCount
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
