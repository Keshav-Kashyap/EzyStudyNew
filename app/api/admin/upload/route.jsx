import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// POST - Upload file to Cloudinary
export async function POST(request) {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'study-materials';

        if (!file) {
            return NextResponse.json({
                success: false,
                error: "No file provided"
            }, { status: 400 });
        }

        // Convert file to base64 for Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: dataUri,
                    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                    folder: folder,
                    resource_type: 'auto', // Auto-detect file type
                    public_id: `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`,
                })
            }
        );

        const result = await cloudinaryResponse.json();

        if (!cloudinaryResponse.ok) {
            throw new Error(result.error?.message || 'Upload failed');
        }

        return NextResponse.json({
            success: true,
            message: "File uploaded successfully",
            file: {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes,
                originalName: file.name,
                uploadedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error uploading file:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to upload file",
            details: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete file from Cloudinary
export async function DELETE(request) {
    try {
        const user = await currentUser();

        if (!user || !user.publicMetadata?.isAdmin) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized access"
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json({
                success: false,
                error: "Public ID is required"
            }, { status: 400 });
        }

        // Delete from Cloudinary
        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    timestamp: Math.round((new Date).getTime() / 1000)
                })
            }
        );

        const result = await cloudinaryResponse.json();

        return NextResponse.json({
            success: true,
            message: "File deleted successfully",
            result
        });

    } catch (error) {
        console.error('❌ Error deleting file:', error);
        return NextResponse.json({
            success: false,
            error: "Failed to delete file",
            details: error.message
        }, { status: 500 });
    }
}