import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL);

        // Add isPinned and pinnedAt columns to material_subject_mapping table
        await sql`
            ALTER TABLE material_subject_mapping 
            ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN DEFAULT false
        `;

        await sql`
            ALTER TABLE material_subject_mapping 
            ADD COLUMN IF NOT EXISTS "pinnedAt" TIMESTAMP
        `;

        // Create an index for better query performance
        await sql`
            CREATE INDEX IF NOT EXISTS idx_mapping_pinned 
            ON material_subject_mapping("subjectId", "isPinned", "pinnedAt")
        `;

        return NextResponse.json({
            success: true,
            message: 'Pin columns added successfully to material_subject_mapping table'
        });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
