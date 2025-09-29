# Complete Environment Variables Setup Guide

## Required Environment Variables

### Database Configuration
```bash
# Your PostgreSQL Database URL (from Vercel/Supabase/Railway etc.)
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Clerk Authentication
```bash
# Get these from your Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Sign in/up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### Cloudinary Configuration (IMPORTANT!)
```bash
# Get these from your Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-api-secret"

# Upload preset (create in Cloudinary dashboard)
CLOUDINARY_UPLOAD_PRESET="ezy-learn-materials"
```

## Cloudinary Setup Instructions

1. **Create Cloudinary Account**: Go to https://cloudinary.com/
2. **Get API Keys**: Dashboard → Settings → API Keys
3. **Create Upload Preset**:
   - Go to Settings → Upload → Upload Presets
   - Click "Add upload preset"
   - Preset name: `ezy-learn-materials`
   - Signing Mode: `Unsigned`
   - Folder: `ezy-learn`
   - Save

## Admin User Setup

To make a user admin, add this to their Clerk metadata:
```json
{
  "isAdmin": true
}
```

## Database Migration Commands

```bash
# Generate migration
npx drizzle-kit generate:pg

# Push to database
npx drizzle-kit push:pg

# Check database
npx drizzle-kit studio
```

## File Upload Features

✅ **PDF, DOC, PPT Support**
✅ **Image Support (JPG, PNG)**
✅ **Automatic file type detection**
✅ **File size optimization**
✅ **Secure cloud storage**
✅ **Direct file links**

## Admin Features Included

✅ **Complete Course Management**
✅ **Semester Organization**
✅ **Subject Creation**
✅ **PDF/Material Upload**
✅ **Cloudinary Integration**
✅ **Real Database Storage**
✅ **Admin-only Access**
✅ **User Role Management**

---

**Note**: Add all these variables to your `.env.local` file and restart your development server!