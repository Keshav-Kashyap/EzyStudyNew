
import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, desc, sql, like } from "drizzle-orm";

export async function GET() {
    try {
        // Fetch popular notes - materials tagged with "popular"
        const notes = await db
            .select({
                id: studyMaterialsTable.id,
                title: studyMaterialsTable.title,
                description: studyMaterialsTable.description,
                fileUrl: studyMaterialsTable.fileUrl,
                downloadCount: studyMaterialsTable.downloadCount,
                likes: studyMaterialsTable.likes,
                type: studyMaterialsTable.type,
                imageUrl: studyMaterialsTable.imageUrl,
                tags: studyMaterialsTable.tags,
                createdAt: studyMaterialsTable.createdAt,
                subjectId: studyMaterialsTable.subjectId,
            })
            .from(studyMaterialsTable)
            .where(like(studyMaterialsTable.tags, '%popular%'))
            .orderBy(desc(studyMaterialsTable.downloadCount))
            .limit(10);

        return NextResponse.json({
            success: true,
            notes: notes,
            count: notes.length
        });
    } catch (e) {
        console.error("Error fetching popular notes:", e);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch popular notes"
            },
            { status: 500 }
        );
    }
}
