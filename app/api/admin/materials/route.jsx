import { db } from "@/config/db";
import { studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
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

        if (!materialId) {
            return NextResponse.json(
                { success: false, error: "Material ID is required" },
                { status: 400 }
            );
        }

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
            message: "Material deleted successfully",
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
