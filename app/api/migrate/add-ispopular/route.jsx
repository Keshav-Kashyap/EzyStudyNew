import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL);

        // Add isPopular column
        await sql`
            ALTER TABLE study_materials 
            ADD COLUMN IF NOT EXISTS "isPopular" boolean DEFAULT false
        `;

        // Auto-mark materials with 50+ likes as popular
        await sql`
            UPDATE study_materials 
            SET "isPopular" = true 
            WHERE likes >= 50
        `;

        return NextResponse.json({
            success: true,
            message: 'isPopular column added successfully'
        });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
