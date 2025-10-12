import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/admin-auth";

export async function GET() {
    try {
        const adminCheck = await checkAdminAccess();

        return NextResponse.json({
            success: true,
            ...adminCheck,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error checking admin status:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            isAuthenticated: false,
            isAdmin: false
        }, { status: 500 });
    }
}