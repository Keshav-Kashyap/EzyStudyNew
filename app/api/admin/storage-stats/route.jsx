import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '@/config/db';
import { studyMaterialsTable } from '@/config/schema';
import { sql } from 'drizzle-orm';

// Initialize Supabase client
let supabase;
try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );
    }
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
}

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({
                success: false,
                error: 'Supabase not configured',
                data: {
                    storageUsed: 0,
                    totalStorage: 1,
                    availableStorage: 1,
                    percentageUsed: 0,
                    bucketName: 'Not configured',
                    filesCount: 0,
                    isConfigured: false
                }
            });
        }

        // Get bucket information
        const bucketName = 'study-materials';

        // List all files in the bucket to calculate size
        const { data: files, error: listError } = await supabase.storage
            .from(bucketName)
            .list('', {
                limit: 1000,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (listError) {
            console.error('Error listing files:', listError);
            throw listError;
        }

        // Calculate total storage used by iterating through files
        let totalBytes = 0;
        let filesCount = 0;

        // Recursive function to get all files in folders
        const getAllFilesSize = async (path = '') => {
            const { data: items, error } = await supabase.storage
                .from(bucketName)
                .list(path, {
                    limit: 1000
                });

            if (error) {
                console.error('Error in folder:', path, error);
                return;
            }

            for (const item of items) {
                if (item.metadata?.size) {
                    totalBytes += item.metadata.size;
                    filesCount++;
                } else if (item.id === null) {
                    // It's a folder, recurse into it
                    const newPath = path ? `${path}/${item.name}` : item.name;
                    await getAllFilesSize(newPath);
                }
            }
        };

        await getAllFilesSize();

        // Convert bytes to GB
        const storageUsedGB = totalBytes / (1024 * 1024 * 1024);

        // Supabase free tier is 1GB, Pro tier starts at 8GB
        // You can adjust this based on your plan
        const totalStorageGB = 1; // Free tier default
        const availableStorageGB = totalStorageGB - storageUsedGB;
        const percentageUsed = (storageUsedGB / totalStorageGB) * 100;

        // Get total materials count from database
        const [materialsCount] = await db
            .select({ count: sql`count(*)` })
            .from(studyMaterialsTable);

        return NextResponse.json({
            success: true,
            data: {
                storageUsed: parseFloat(storageUsedGB.toFixed(3)),
                totalStorage: totalStorageGB,
                availableStorage: parseFloat(availableStorageGB.toFixed(3)),
                percentageUsed: parseFloat(percentageUsed.toFixed(2)),
                bucketName: bucketName,
                filesCount: filesCount,
                materialsInDb: parseInt(materialsCount.count),
                isConfigured: true,
                lastUpdated: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error fetching storage stats:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch storage statistics',
            data: {
                storageUsed: 0,
                totalStorage: 1,
                availableStorage: 1,
                percentageUsed: 0,
                bucketName: 'study-materials',
                filesCount: 0,
                isConfigured: false
            }
        }, { status: 500 });
    }
}
