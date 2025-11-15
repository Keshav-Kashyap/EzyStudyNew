import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { studyMaterialsTable, subjectsTable, materialSubjectMappingTable } from "@/config/schema";
import { eq, and } from "drizzle-orm";
import JSZip from "jszip";

export async function POST(request) {
    try {
        const { category, semesterName } = await request.json();

        if (!category || !semesterName) {
            return NextResponse.json({
                success: false,
                error: "Category and semester name are required"
            }, { status: 400 });
        }

        // Get all subjects for this semester
        const subjects = await db
            .select()
            .from(subjectsTable)
            .where(
                and(
                    eq(subjectsTable.category, category),
                    eq(subjectsTable.semesterName, semesterName)
                )
            );

        if (subjects.length === 0) {
            return NextResponse.json({
                success: false,
                error: "No subjects found for this semester"
            }, { status: 404 });
        }

        // Get all materials for all subjects
        const allMaterials = [];

        for (const subject of subjects) {
            const materials = await db
                .select({
                    id: studyMaterialsTable.id,
                    title: studyMaterialsTable.title,
                    fileUrl: studyMaterialsTable.fileUrl,
                    type: studyMaterialsTable.type,
                    subjectName: subjectsTable.name,
                    subjectCode: subjectsTable.code,
                })
                .from(studyMaterialsTable)
                .innerJoin(
                    materialSubjectMappingTable,
                    eq(studyMaterialsTable.id, materialSubjectMappingTable.materialId)
                )
                .innerJoin(
                    subjectsTable,
                    eq(materialSubjectMappingTable.subjectId, subjectsTable.id)
                )
                .where(eq(materialSubjectMappingTable.subjectId, subject.id));

            allMaterials.push(...materials);
        }

        if (allMaterials.length === 0) {
            return NextResponse.json({
                success: false,
                error: "No materials found for this semester"
            }, { status: 404 });
        }

        // Return materials data for client-side ZIP creation
        // Group materials by subject
        const materialsBySubject = allMaterials.reduce((acc, material) => {
            const subjectKey = `${material.subjectCode} - ${material.subjectName}`;
            if (!acc[subjectKey]) {
                acc[subjectKey] = [];
            }
            acc[subjectKey].push({
                title: material.title,
                url: material.fileUrl,
                type: material.type
            });
            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                semester: `${category} - ${semesterName}`,
                totalMaterials: allMaterials.length,
                totalSubjects: subjects.length,
                materialsBySubject: materialsBySubject,
                materials: allMaterials.map(m => ({
                    title: m.title,
                    url: m.fileUrl,
                    subject: `${m.subjectCode} - ${m.subjectName}`,
                    type: m.type
                }))
            }
        });

    } catch (error) {
        console.error('Error fetching semester materials:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch materials",
            details: error.message
        }, { status: 500 });
    }
}
