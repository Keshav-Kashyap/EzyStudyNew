
import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
    try {
        // Fetch popular notes - either tagged as popular or sort by download count
        const notes = await db
            .select({
                id: studyMaterialsTable.id,
                title: studyMaterialsTable.title,
                description: studyMaterialsTable.description,
                fileUrl: studyMaterialsTable.fileUrl,
                downloadCount: studyMaterialsTable.downloadCount,
                tags: studyMaterialsTable.tags,
                createdAt: studyMaterialsTable.createdAt,
                subjectCode: studyMaterialsTable.subjectCode,
                semesterId: studyMaterialsTable.semesterId,
            })
            .from(studyMaterialsTable)
            .where(eq(studyMaterialsTable.tags, "popular"))
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
