import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { studyMaterialsTable } from "@/config/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        console.log("Search API called with query:", query);

        if (!query || query.trim().length === 0) {
            return NextResponse.json({
                success: false,
                error: "Search query is required"
            }, { status: 400 });
        }

        // Create flexible search patterns for spelling mistakes
        const searchTerm = `%${query.trim()}%`;
        
        // Search only in study_materials table by title, description, and tags
        const materials = await db
            .select({
                id: studyMaterialsTable.id,
                title: studyMaterialsTable.title,
                description: studyMaterialsTable.description,
                type: studyMaterialsTable.type,
                fileUrl: studyMaterialsTable.fileUrl,
                imageUrl: studyMaterialsTable.imageUrl,
                downloadCount: studyMaterialsTable.downloadCount,
                likes: studyMaterialsTable.likes,
                tags: studyMaterialsTable.tags,
                isActive: studyMaterialsTable.isActive,
            })
            .from(studyMaterialsTable)
            .where(
                or(
                    ilike(studyMaterialsTable.title, searchTerm),
                    ilike(studyMaterialsTable.description, searchTerm),
                    ilike(studyMaterialsTable.tags, searchTerm),
                    ilike(studyMaterialsTable.type, searchTerm)
                )
            )
            .limit(50);

        console.log("Found materials:", materials.length);

        // Filter only active materials
        const activeResults = materials.filter(m => m.isActive !== false);

        return NextResponse.json({
            success: true,
            results: activeResults,
            count: activeResults.length
        });

    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to search materials",
            details: error.message
        }, { status: 500 });
    }
}
