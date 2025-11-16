import { checkAdminAccess } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const adminCheck = await checkAdminAccess();

        return NextResponse.json({
            isAdmin: adminCheck.isAdmin,
            isAuthenticated: adminCheck.isAuthenticated
        });
    } catch (error) {
        return NextResponse.json({
            isAdmin: false,
            isAuthenticated: false,
            error: error.message
        }, { status: 500 });
    }
}
