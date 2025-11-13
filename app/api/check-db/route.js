import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { usersTable } from '@/config/schema';
import { sql } from 'drizzle-orm';

/**
 * GET /api/check-db
 * Test database connection and return status
 */
export async function GET() {
    try {
        const startTime = Date.now();

        // Test basic query
        const result = await db.execute(sql`SELECT 1 as test`);

        const duration = Date.now() - startTime;

        // Test table access
        const userCount = await db.select().from(usersTable).limit(1);

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            hasData: userCount.length > 0,
        });
    } catch (error) {
        console.error('Database connection test failed:', error);

        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
            timestamp: new Date().toISOString(),
            hint: 'Check your DATABASE_URL environment variable',
        }, { status: 500 });
    }
}
