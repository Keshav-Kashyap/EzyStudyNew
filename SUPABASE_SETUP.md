# 🔧 Supabase Setup Guide

## Current Status
✅ **App is working** - Using fallback URL-based method for materials
⚠️ **File upload disabled** - Actual file storage requires Supabase configuration

## Quick Fix Applied
The app now saves material records to the database with placeholder URLs when Supabase is not configured. This allows you to:
- ✅ Create materials
- ✅ Associate them with subjects
- ✅ Display them in the UI
- ❌ Actual file download won't work (placeholder URL)

## To Enable Real File Uploads

### Step 1: Get Supabase Credentials
1. Go to https://supabase.com
2. Create a free project (if you don't have one)
3. Get your credentials:
   - Project URL (Settings → API)
   - Service Role Key (Settings → API → Service Role Key)

### Step 2: Create Storage Bucket
1. In Supabase Dashboard → Storage
2. Create new bucket: `study-materials`
3. Set as **public** bucket
4. Add RLS policy:
   ```sql
   -- Allow authenticated uploads
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'study-materials');

   -- Allow public downloads
   CREATE POLICY "Allow public downloads"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'study-materials');
   ```

### Step 3: Add Environment Variables
Create `.env.local` file in project root:

```env
# Your existing variables
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Add these Supabase variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Restart Dev Server
```bash
npm run dev
```

## Alternative: Use Your Own Storage
You can also modify the upload route to use:
- AWS S3
- Cloudinary
- Azure Blob Storage
- Local server storage

Just update the `handleUrlBasedUpload` function in `app/api/admin/upload/route.jsx`

## Current Behavior
- Material records are saved to database ✅
- Placeholder URLs are generated ✅
- Download button shows but won't work properly ⚠️
- You can manually update file URLs in database if needed ✅

## Need Help?
If you want to set up Supabase, let me know and I can guide you through each step!
