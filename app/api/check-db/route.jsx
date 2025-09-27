import { db } from "@/config/db";
import { courses, semesters, subjects, resources, usersTable } from "@/drizzel/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Check all tables data
        const coursesData = await db.select().from(courses);
        const semestersData = await db.select().from(semesters);
        const subjectsData = await db.select().from(subjects);
        const resourcesData = await db.select().from(resources);
        const usersData = await db.select().from(usersTable);

        return NextResponse.json({
            message: "Database status check",
            data: {
                users: {
                    count: usersData.length,
                    data: usersData
                },
                courses: {
                    count: coursesData.length,
                    data: coursesData
                },
                semesters: {
                    count: semestersData.length,
                    data: semestersData
                },
                subjects: {
                    count: subjectsData.length,
                    data: subjectsData
                },
                resources: {
                    count: resourcesData.length,
                    data: resourcesData
                }
            }
        });

    } catch (error) {
        console.error('❌ Error checking database:', error);
        return NextResponse.json({
            error: "Failed to check database",
            details: error.message
        }, { status: 500 });
    }
}