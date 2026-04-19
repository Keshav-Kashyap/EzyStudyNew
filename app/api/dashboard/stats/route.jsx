// import { db } from "@/config/db";
// import { coursesTable, semestersTable, studyMaterialsTable } from "@/config/schema";
// import { NextResponse } from "next/server";
// import { count } from "drizzle-orm";

// export async function GET() {
//     try {
//         const [coursesCount] = await db.select({ count: count() }).from(coursesTable);
//         const [semestersCount] = await db.select({ count: count() }).from(semestersTable);
//         const [materialsCount] = await db.select({ count: count() }).from(studyMaterialsTable);

//         return NextResponse.json({
//             success: true,
//             stats: {
//                 totalCourses: coursesCount.count,
//                 totalSemesters: semestersCount.count,
//                 totalMaterials: materialsCount.count,
//                 averageRating: 4.8 // Static for now
//             }
//         });

//     } catch (error) {
//         console.error(' Error fetching dashboard stats:', error);
//         return NextResponse.json({
//             success: false,
//             error: "Failed to fetch dashboard stats",
//             details: error.message
//         }, { status: 500 });
//     }
// }