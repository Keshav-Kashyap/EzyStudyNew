import { db } from "@/config/db";
import { subjectsTable, studyMaterialsTable, materialSubjectMappingTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { category, semesterName } = await req.json();

        if (!category || !semesterName) {
            return NextResponse.json(
                { success: false, error: 'Category and semester name are required' },
                { status: 400 }
            );
        }

        // Get all subjects for this semester
        const subjects = await db
            .select({
                id: subjectsTable.id,
                name: subjectsTable.name,
                code: subjectsTable.code,
            })
            .from(subjectsTable)
            .where(
                and(
                    eq(subjectsTable.category, category),
                    eq(subjectsTable.semesterName, semesterName)
                )
            );

        if (!subjects || subjects.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No subjects found for this semester' },
                { status: 404 }
            );
        }

        const subjectIds = subjects.map(s => s.id);

        // Get all syllabus materials (type='SYLLABUS') for these subjects
        const syllabiWithSubjects = await db
            .select({
                materialId: studyMaterialsTable.id,
                title: studyMaterialsTable.title,
                fileUrl: studyMaterialsTable.fileUrl,
                subjectId: materialSubjectMappingTable.subjectId,
            })
            .from(studyMaterialsTable)
            .innerJoin(
                materialSubjectMappingTable,
                eq(studyMaterialsTable.id, materialSubjectMappingTable.materialId)
            )
            .where(
                and(
                    eq(studyMaterialsTable.type, 'SYLLABUS'),
                    eq(studyMaterialsTable.isActive, true)
                )
            );

        // Filter by subject IDs and map to subjects
        const syllabi = syllabiWithSubjects
            .filter(item => subjectIds.includes(item.subjectId))
            .map(item => {
                const subject = subjects.find(s => s.id === item.subjectId);
                return {
                    materialId: item.materialId,
                    title: item.title,
                    fileUrl: item.fileUrl,
                    subjectId: item.subjectId,
                    name: subject?.name || 'Unknown',
                    code: subject?.code || 'N/A',
                };
            });

        if (syllabi.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No syllabus available for this semester' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            syllabi,
            totalSubjects: subjects.length,
            syllabusCount: syllabi.length
        });

    } catch (error) {
        console.error('Error fetching semester syllabus:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch syllabus' },
            { status: 500 }
        );
    }
}
