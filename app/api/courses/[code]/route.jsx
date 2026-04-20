import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable, materialSubjectMappingTable, usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { auth } from '@clerk/nextjs/server';

export async function GET(request, { params }) {
    try {
        const { code } = await params;
        const normalizedCode = code?.trim();
        const { userId: clerkUserId } = await auth();

        // Get user role if authenticated
        let isAdmin = false;
        if (clerkUserId) {
            const [user] = await db.select()
                .from(usersTable)
                .where(eq(usersTable.userId, clerkUserId));

            isAdmin = user?.role === 'admin';
        }

        // Find course by category/code
        const courses = await db.select().from(coursesTable)
            .where(sql`lower(${coursesTable.category}) = lower(${normalizedCode})`);

        if (courses.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Course not found"
            }, { status: 404 });
        }

        const course = courses[0];

        // Get ALL semesters for this course category (both active and inactive)
        // Users can see all semesters but cannot access inactive ones
        const semesters = await db.select().from(semestersTable)
            .where(eq(semestersTable.category, course.category));

        // Get subjects for each semester
        const semestersWithSubjects = await Promise.all(
            semesters.map(async (semester) => {
                const subjects = await db.select().from(subjectsTable)
                    .where(and(
                        eq(subjectsTable.category, course.category),
                        eq(subjectsTable.semesterName, semester.name)
                    ));

                // Get study materials for each subject through mapping table
                const subjectsWithMaterials = await Promise.all(
                    subjects.map(async (subject) => {
                        const materialsWithMapping = await db
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
                            })
                            .from(studyMaterialsTable)
                            .innerJoin(
                                materialSubjectMappingTable,
                                eq(studyMaterialsTable.id, materialSubjectMappingTable.materialId)
                            )
                            .where(eq(materialSubjectMappingTable.subjectId, subject.id));

                        return {
                            ...subject,
                            materials: materialsWithMapping
                        };
                    })
                );

                return {
                    ...semester,
                    subjects: subjectsWithMaterials
                };
            })
        );

        // Sort semesters in ascending order (1, 2, 3, 4...)
        // Extract number from semester name and sort
        const sortedSemesters = semestersWithSubjects.sort((a, b) => {
            // Extract numbers from semester names like "Semester 1", "Sem 1", "1st Semester", etc.
            const getNumber = (name) => {
                const match = name.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            };
            return getNumber(a.name) - getNumber(b.name);
        });

        // Calculate totals
        const totalSubjects = sortedSemesters.reduce((sum, sem) => sum + sem.subjects.length, 0);
        const totalMaterials = sortedSemesters.reduce((sum, sem) =>
            sum + sem.subjects.reduce((subSum, sub) => subSum + sub.materials.length, 0), 0
        );

        return NextResponse.json({
            success: true,
            course: {
                ...course,
                semesters: sortedSemesters,
                stats: {
                    totalSemesters: semesters.length,
                    totalSubjects,
                    totalMaterials
                }
            }
        });

    } catch (error) {
        console.error(' Error fetching course details:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch course details",
            details: error.message
        }, { status: 500 });
    }
}