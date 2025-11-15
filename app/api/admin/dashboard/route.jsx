import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// GET - Fetch admin dashboard stats
export async function GET() {
    try {
        const user = await currentUser();

        // Check if user is admin (you can modify this logic)
        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        // Get total counts
        const courses = await db.select().from(coursesTable);
        const semesters = await db.select().from(semestersTable);
        const subjects = await db.select().from(subjectsTable);
        const materials = await db.select({
            id: studyMaterialsTable.id,
            title: studyMaterialsTable.title,
            type: studyMaterialsTable.type,
            fileUrl: studyMaterialsTable.fileUrl,
            downloadCount: studyMaterialsTable.downloadCount,
            createdAt: studyMaterialsTable.createdAt
        }).from(studyMaterialsTable);

        // Calculate active semesters
        const activeSemesters = semesters.filter(sem => sem.isActive);

        // Get recent uploads (last 5 materials)
        const recentUploads = await db.select({
            id: studyMaterialsTable.id,
            title: studyMaterialsTable.title,
            type: studyMaterialsTable.type,
            createdAt: studyMaterialsTable.createdAt,
            downloadCount: studyMaterialsTable.downloadCount
        }).from(studyMaterialsTable)
            .orderBy(studyMaterialsTable.createdAt)
            .limit(5);

        return NextResponse.json({
            success: true,
            stats: {
                totalCourses: courses.length,
                totalLibraries: courses.length, // Same as courses for now
                activeSemesters: activeSemesters.length,
                totalMaterials: materials.length,
                totalSubjects: subjects.length
            },
            recentUploads,
            courses: courses.map(course => ({
                ...course,
                semesterCount: semesters.filter(sem => sem.category === course.category).length
            }))
        });

    } catch (error) {
        console.error(' Error fetching admin dashboard:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch dashboard data",
            details: error.message
        }, { status: 500 });
    }
}

// POST - Create new course/library
export async function POST(request) {
    try {
        const user = await currentUser();

        // Check if user is admin
        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const body = await request.json();
        const {
            title,
            subtitle,
            description,
            category,
            totalSemesters = 6,
            studentsCount = 0,
            documentsCount = 0
        } = body;

        if (!title || !category) {
            return NextResponse.json({
                success: false,
                error: "Title and category are required"
            }, { status: 400 });
        }

        // Create new course
        const newCourse = await db.insert(coursesTable).values({
            title,
            subtitle: subtitle || `${category} Program`,
            description: description || `Comprehensive ${category} curriculum with practical learning approach.`,
            category: category.toUpperCase(),
            bgColor: getBgColorForCategory(category),
            studentsCount: studentsCount || 0,
            documentsCount: documentsCount || 0,
            isActive: true
        }).returning();

        // Create semesters for the course
        const semesterData = [];
        for (let i = 1; i <= totalSemesters; i++) {
            semesterData.push({
                category: category.toUpperCase(),
                name: `Semester ${i}`,
                description: `${category} Semester ${i} - Core subjects and practical learning`,
                isActive: i <= 2 // Make first 2 semesters active by default
            });
        }

        const createdSemesters = await db.insert(semestersTable).values(semesterData).returning();

        return NextResponse.json({
            success: true,
            message: "Course created successfully",
            course: {
                ...newCourse[0],
                semesters: createdSemesters
            }
        });

    } catch (error) {
        console.error(' Error creating course:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to create course",
            details: error.message
        }, { status: 500 });
    }
}

// Helper function to get background color based on category
function getBgColorForCategory(category) {
    const colors = {
        'MCA': 'bg-blue-500',
        'BCA': 'bg-green-500',
        'BTECH': 'bg-purple-500',
        'MBA': 'bg-orange-500',
        'MSC': 'bg-indigo-500'
    };
    return colors[category.toUpperCase()] || 'bg-gray-500';
}