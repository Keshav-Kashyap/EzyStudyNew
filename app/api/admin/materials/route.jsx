import { db } from "@/config/db";
import { adminMaterials, adminSubjects, adminSemesters, adminCourses } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET - Fetch all materials for admin
export async function GET() {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        // Get all materials with subject and course info
        const allMaterials = await db.select({
            id: adminMaterials.id,
            title: adminMaterials.title,
            materialType: adminMaterials.materialType,
            fileUrl: adminMaterials.fileUrl,
            description: adminMaterials.description,
            downloadCount: adminMaterials.downloadCount,
            courseId: adminMaterials.courseId,
            semesterId: adminMaterials.semesterId,
            subjectId: adminMaterials.subjectId,
            cloudinaryPublicId: adminMaterials.cloudinaryPublicId,
            fileSize: adminMaterials.fileSize,
            createdAt: adminMaterials.createdAt,
            subjectName: adminSubjects.name,
            subjectCode: adminSubjects.code,
            semesterName: adminSemesters.name,
            courseName: adminCourses.name,
            courseCode: adminCourses.code
        })
            .from(adminMaterials)
            .leftJoin(adminSubjects, eq(adminMaterials.subjectId, adminSubjects.id))
            .leftJoin(adminSemesters, eq(adminMaterials.semesterId, adminSemesters.id))
            .leftJoin(adminCourses, eq(adminMaterials.courseId, adminCourses.id))
            .orderBy(adminMaterials.createdAt);

        return NextResponse.json({
            success: true,
            materials: allMaterials
        });

    } catch (error) {
        console.error('❌ Error fetching materials:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch materials",
            details: error.message
        }, { status: 500 });
    }
}

// POST - Upload new material
export async function POST(request) {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const body = await request.json();
        const {
            title,
            description,
            materialType = 'notes',
            fileUrl,
            courseId,
            semesterId,
            subjectId,
            cloudinaryPublicId,
            fileSize
        } = body;

        if (!title || !fileUrl || !courseId || !semesterId || !subjectId) {
            return NextResponse.json({
                success: false,
                error: "Title, file URL, course ID, semester ID, and subject ID are required"
            }, { status: 400 });
        }

        // Verify subject exists
        const subject = await db.select().from(adminSubjects)
            .where(eq(adminSubjects.id, parseInt(subjectId)));

        if (subject.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Subject not found"
            }, { status: 404 });
        }

        // Create new material
        const newMaterial = await db.insert(adminMaterials).values({
            title,
            description: description || '',
            materialType,
            fileUrl,
            courseId: parseInt(courseId),
            semesterId: parseInt(semesterId),
            subjectId: parseInt(subjectId),
            cloudinaryPublicId,
            fileSize: fileSize || null,
            downloadCount: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Material uploaded successfully",
            material: newMaterial[0]
        });

    } catch (error) {
        console.error('❌ Error uploading material:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to upload material",
            details: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete material
export async function DELETE(request) {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const materialId = searchParams.get('id');

        if (!materialId) {
            return NextResponse.json({
                success: false,
                error: "Material ID is required"
            }, { status: 400 });
        }

        // Delete material
        await db.delete(adminMaterials)
            .where(eq(adminMaterials.id, parseInt(materialId)));

        return NextResponse.json({
            success: true,
            message: "Material deleted successfully"
        });

    } catch (error) {
        console.error('❌ Error deleting material:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to delete material",
            details: error.message
        }, { status: 500 });
    }
}