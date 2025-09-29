# Cloudinary Setup Instructions

## 📚 Free Cloudinary Account Setup (FREE - 25GB Storage)

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Create account with email/password
4. Verify your email

### Step 2: Get Your Credentials
1. Login to Cloudinary Dashboard
2. Go to **Dashboard** → **API Keys**
3. Copy these values:
   - Cloud Name
   - API Key  
   - API Secret

### Step 3: Create Upload Preset
1. In Cloudinary Dashboard → **Settings** → **Upload**
2. Click **Add upload preset**
3. Set:
   - **Preset name**: `ezy-learn-materials`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `study-materials`
   - **Resource Type**: `Auto`
4. Click **Save**

### Step 4: Add Environment Variables
Add these to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_UPLOAD_PRESET=ezy-learn-materials
```

### Step 5: Install Cloudinary Package (Optional - for direct integration)
```bash
npm install cloudinary
```

## 📤 API Usage

### Upload File
```javascript
// Frontend upload example
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'study-materials');
  
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result;
};
```

### Delete File
```javascript
// Delete file by public ID
const deleteFile = async (publicId) => {
  const response = await fetch(`/api/admin/upload?publicId=${publicId}`, {
    method: 'DELETE'
  });
  
  const result = await response.json();
  return result;
};
```

## 📁 File Organization
Files will be organized as:
- `study-materials/course-code/semester-id/subject-id/filename.pdf`
- Example: `study-materials/mca/sem1/dsa/data-structures-notes.pdf`

## 💾 Storage Limits
- **Free Plan**: 25GB storage, 25GB bandwidth/month
- **Supported formats**: PDF, DOC, DOCX, PPT, PPTX, Images, Videos
- **Max file size**: 100MB per file

## 🔒 Security
- Only admin users can upload/delete files
- Files are stored with unique public IDs
- Upload preset prevents unauthorized uploads