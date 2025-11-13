import { db } from "@/config/db";
import { semestersTable, subjectsTable, studyMaterialsTable, coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(request, { params }) {
    try {
        const { code, semesterId } = await params;

        // Convert URL format back to database format
        // "semester-1" -> "Semester 1"
        const semesterName = semesterId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Get semester details by name and course category
        const semesters = await db.select().from(semestersTable)
            .where(and(
                eq(semestersTable.category, code.toUpperCase()),
                eq(semestersTable.name, semesterName)
            ));

        if (semesters.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Semester not found"
            }, { status: 404 });
        }

        const semester = semesters[0];

        // Get subjects for this semester using category and semesterName
        const subjects = await db.select().from(subjectsTable)
            .where(and(
                eq(subjectsTable.category, code.toUpperCase()),
                eq(subjectsTable.semesterName, semester.name)
            ));

        // Get study materials for each subject
        const subjectsWithMaterials = await Promise.all(
            subjects.map(async (subject) => {
                const materials = await db.select().from(studyMaterialsTable)
                    .where(eq(studyMaterialsTable.subjectId, subject.id));

                return {
                    ...subject,
                    materials: materials.map(material => ({
                        ...material,
                        downloadUrl: material.fileUrl,
                        size: '2.5 MB', // Default size, could be calculated
                        lastUpdated: material.createdAt
                    }))
                };
            })
        );

        return NextResponse.json({
            success: true,
            semester: {
                ...semester,
                subjects: subjectsWithMaterials,
                stats: {
                    totalSubjects: subjects.length,
                    totalMaterials: subjectsWithMaterials.reduce((sum, sub) => sum + sub.materials.length, 0)
                }
            }
        });

    } catch (error) {
        console.error(' Error fetching semester details:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch semester details",
            details: error.message
        }, { status: 500 });
    }
}