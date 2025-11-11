
import { db } from "@/config/db";
import { coursesTable, semestersTable, subjectsTable, studyMaterialsTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
<<<<<<< HEAD

=======
>>>>>>> f9fb03752a3e7f7ce48d0e4f077714e5ccf47286

export async function GET() {

    try {
        const notes = await db.select()
            .from(studyMaterialsTable)
            .where(eq(studyMaterialsTable.tags, "popular"));


        return Response.json(notes);

    } catch (e) {
        console.log("Error Occuring in Fetching Popular Notes in Server!!!");
        return Response.json({ error: "Failed to fetch data" }, { status: 500 });
    }



}
