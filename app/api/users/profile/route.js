import { db } from "@/config/db";
import { coursesTable, userProfileTable, usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        const dbUser = await db.select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.userId, clerkUser.id))
            .limit(1);

        if (!dbUser.length) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const profile = await db.select()
            .from(userProfileTable)
            .where(eq(userProfileTable.userId, dbUser[0].id))
            .orderBy(desc(userProfileTable.id))
            .limit(1);

        if (!profile.length) {
            return NextResponse.json({
                success: false,
                message: "Profile not found"
            }, { status: 404 });
        }

        const course = profile[0].courseId
            ? await db.select({ id: coursesTable.id, name: coursesTable.category })
                .from(coursesTable)
                .where(eq(coursesTable.id, profile[0].courseId))
                .limit(1)
            : [];

        return NextResponse.json({
            success: true,
            profile: profile[0],
            course: course[0] || null,
            preferredSemester: Number(clerkUser?.publicMetadata?.preferredSemester || 0) || null,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch profile"
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const clerkUser = await currentUser();
        const body = await req.json();

        const { user_id, course_id, semester, heard_from } = body;

        // basic validation
        if (!user_id || !course_id || !semester) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        const existingProfile = await db.select({ id: userProfileTable.id })
            .from(userProfileTable)
            .where(eq(userProfileTable.userId, user_id))
            .orderBy(desc(userProfileTable.id))
            .limit(1);

        let profile;

        if (existingProfile.length) {
            const updated = await db.update(userProfileTable)
                .set({
                    courseId: course_id,
                    heardFrom: heard_from,
                })
                .where(eq(userProfileTable.id, existingProfile[0].id))
                .returning();
            profile = updated[0];
        } else {
            const inserted = await db.insert(userProfileTable).values({
                userId: user_id,
                courseId: course_id,
                heardFrom: heard_from
            }).returning();
            profile = inserted[0];
        }

        // Store preferred semester in Clerk metadata so it survives local storage clears.
        if (clerkUser?.id) {
            try {
                const client = await clerkClient();
                const nextPublicMetadata = {
                    ...(clerkUser.publicMetadata || {}),
                    preferredSemester: Number(semester),
                };

                await client.users.updateUserMetadata(clerkUser.id, {
                    publicMetadata: nextPublicMetadata,
                });
            } catch (metadataError) {
                console.error("Failed to update preferred semester metadata:", metadataError);
            }
        }

        return NextResponse.json({
            success: true,
            profile,
            selectedSemester: Number(semester)
        });

    } catch (error) {
        console.error("Error creating profile:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create profile"
        }, { status: 500 });
    }
}