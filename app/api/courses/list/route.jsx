import { db, withRetry } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and, count } from "drizzle-orm";

export async function GET() {
    const courses = await db.select({
        id: coursesTable.id,
        name: coursesTable.category
    }).from(coursesTable);

    return NextResponse.json({
        success: true,
        courses
    });
}