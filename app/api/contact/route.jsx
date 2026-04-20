import { db } from "@/config/db";
import { contactSubmissionsTable } from "@/config/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(req) {

    try {
        const body = await req.json();
        const name = body?.name?.trim();
        const email = body?.email?.trim().toLowerCase();
        const subject = body?.subject?.trim();
        const message = body?.message?.trim();


        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Name, email, subject, and message are required"
                },
                { status: 400 }
            );
        }

        const insertedMessage = await db.insert(contactSubmissionsTable).values({
            name,
            email,
            subject,
            message,
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Your message has been submitted successfully.",
            submission: insertedMessage[0]
        });
    } catch (error) {
        console.error("Error saving contact submission:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to submit message"
            },
            { status: 500 }
        );
    }
}