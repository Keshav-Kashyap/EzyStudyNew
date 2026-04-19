import { db, withRetry } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10")));
        const offset = (page - 1) * limit;

        //total count (for pagination / infinite scroll)
        const [{ total }] = await withRetry(async () => {
            return await db
                .select({ total: count() })
                .from(coursesTable);
        });

        //minimal data only (NO heavy joins, NO loops)
        const courses = await withRetry(async () => {
            return await db
                .select({
                    id: coursesTable.id,
                    category: coursesTable.category,
                    title: coursesTable.title,
                    description: coursesTable.description,
                    image: coursesTable.image,
                    isActive: coursesTable.isActive,
                })
                .from(coursesTable)
                .limit(limit)
                .offset(offset);
        });

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            courses,
            pagination: {
                currentPage: page,
                limit,
                totalCourses: total,
                totalPages,
                hasNextPage: page < totalPages,
            },
        });

    } catch (error) {
        console.error("Error fetching minimal courses:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch minimal courses",
            },
            { status: 500 }
        );
    }
}