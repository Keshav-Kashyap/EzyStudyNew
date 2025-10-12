import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/admin-auth";
import { createClient } from '@supabase/supabase-js';
import { db } from "@/config/db";
import { studyMaterialsTable, subjectsTable } from '@/config/schema';
import { eq } from "drizzle-orm";

// Initialize Supabase client with proper error handling
let supabase;
try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error(' Missing Supabase environment variables');
        throw new Error('Supabase configuration missing');
    }

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
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error(' Failed to initialize Supabase client:', error);
}

// POST - Upload file to Supabase Storage and save to database
export async function POST(request) {
    try {
        // Check Supabase client availability
        if (!supabase) {
            return NextResponse.json({
                success: false,
                error: "Supabase client not initialized. Check environment variables."
            }, { status: 500 });
        }

        const adminCheck = await checkAdminAccess();

        if (!adminCheck.isAuthenticated) {
            return NextResponse.json({
                success: false,
                error: "Please login first"
            }, { status: 401 });
        }

        if (!adminCheck.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Admin access required. Your role: " + (adminCheck.user?.role || 'unknown')
            }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const courseCode = formData.get('courseCode');
        const title = formData.get('title');
        const fileName = formData.get('fileName');
        const fileSize = formData.get('fileSize');
        const fileType = formData.get('fileType');
        console.log("course code:", courseCode);

        if (!file || !courseCode || !title) {
            return NextResponse.json({
                success: false,
                error: "File, course code, and title are required"
            }, { status: 400 });
        }

        // Validate file type (PDF only for now)
        if (file.type !== 'application/pdf') {
            return NextResponse.json({
                success: false,
                error: "Only PDF files are allowed"
            }, { status: 400 });
        }

        // Find subject by code
        const subject = await db.select()
            .from(subjectsTable)
            .where(eq(subjectsTable.code, courseCode.toUpperCase()))
            .limit(1);

        if (!subject[0]) {
            return NextResponse.json({
                success: false,
                error: `Subject with code '${courseCode}' not found. Please create the subject first.`
            }, { status: 404 });
        }

        const subjectId = subject[0].id;

        // Generate unique file name
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/\s+/g, '_');
        const supabaseFileName = `study-materials/${courseCode}/${timestamp}-${cleanFileName}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('study-materials')
            .upload(supabaseFileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            throw new Error(`Supabase upload error: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('study-materials')
            .getPublicUrl(supabaseFileName);

        // Save material to database
        const materialData = await db.insert(studyMaterialsTable).values({
            subjectId: subjectId,
            title: title,
            type: 'PDF', // Material type
            fileUrl: urlData.publicUrl,
            description: `PDF material for ${courseCode} - ${title}`,
            tags: JSON.stringify([courseCode, 'PDF', 'study-material']),
            downloadCount: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Material uploaded and saved successfully",
            data: {
                material: materialData[0],
                subject: subject[0],
                file: {
                    url: urlData.publicUrl,
                    fileName: supabaseFileName,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString(),
                    supabasePath: data.path
                }
            }
        });

    } catch (error) {
        console.error(' Error uploading material:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to upload material",
            details: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete file from Supabase Storage and database
export async function DELETE(request) {
    try {
        const adminCheck = await checkAdminAccess();

        if (!adminCheck.isAuthenticated) {
            return NextResponse.json({
                success: false,
                error: "Please login first"
            }, { status: 401 });
        }

        if (!adminCheck.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Admin access required"
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const materialId = searchParams.get('materialId');

        if (!materialId) {
            return NextResponse.json({
                success: false,
                error: "Material ID is required"
            }, { status: 400 });
        }

        // Get material details from database
        const material = await db.select()
            .from(studyMaterialsTable)
            .where(eq(studyMaterialsTable.id, materialId))
            .limit(1);

        if (!material[0]) {
            return NextResponse.json({
                success: false,
                error: "Material not found"
            }, { status: 404 });
        }

        // Extract fileName from fileUrl for Supabase deletion
        const fileUrl = material[0].fileUrl;
        let fileName = null;

        if (fileUrl && fileUrl.includes('study-materials/')) {
            // Extract the file path from the URL
            const urlParts = fileUrl.split('study-materials/');
            if (urlParts[1]) {
                fileName = `study-materials/${urlParts[1]}`;
            }
        }

        // Delete from Supabase Storage
        if (fileName) {
            const { error } = await supabase.storage
                .from('study-materials')
                .remove([fileName]);

            if (error) {
                console.warn('Supabase delete warning:', error.message);
                // Continue with database deletion even if file deletion fails
            }
        }

        // Delete from database
        await db.delete(studyMaterialsTable)
            .where(eq(studyMaterialsTable.id, materialId));

        return NextResponse.json({
            success: true,
            message: "Material deleted successfully"
        });

    } catch (error) {
        console.error(' Error deleting material:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to delete material",
            details: error.message
        }, { status: 500 });
    }
}