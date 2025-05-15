# Supabase File Upload Integration

This document provides instructions for setting up and using the Supabase file upload functionality in the TAMA Farmers Trust project.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note down your project URL and anon key from the API settings

### 2. Configure Storage Buckets

1. In your Supabase dashboard, navigate to Storage
2. Create the following buckets:
   - `uploads` (general purpose uploads)
   - `shops` (for shop images)
   - Each bucket should have appropriate public/private permissions based on your needs

### 3. Update Environment Variables

Update your `.env` file with the Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure Storage Policies

For public access to uploaded files, set the following policies in your Supabase dashboard:

1. Go to Storage → Policies
2. For each bucket, add appropriate policies:

#### Example Public Read Policy:

```sql
-- Allow public read access to files
(bucket_id = 'shops'::text)
```

#### Example Authenticated Insert Policy:

```sql
-- Allow authenticated users to upload files
(bucket_id = 'shops'::text) AND (auth.role() = 'authenticated'::text)
```

## Usage

### Basic File Upload

```typescript
import { handleSupabaseFileUpload } from "@/lib/utils-supabase"

// Inside your component
const uploadFile = async (file: File) => {
  try {
    const fileUrl = await handleSupabaseFileUpload(
      file,
      "bucketName", // e.g., 'shops'
      "folderPath" // e.g., 'images'
    )

    console.log("Uploaded file URL:", fileUrl)
    return fileUrl
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}
```

### With Progress Tracking

```typescript
const uploadFileWithProgress = async (file: File) => {
  try {
    const fileUrl = await handleSupabaseFileUpload(
      file,
      "bucketName",
      "folderPath",
      (progress) => {
        console.log(`Upload progress: ${progress}%`)
        // Update UI with progress
      }
    )

    return fileUrl
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}
```

### Multiple File Uploads

```typescript
import { handleSupabaseMultipleFileUploads } from "@/lib/utils-supabase"

const uploadMultipleFiles = async (files: File[]) => {
  try {
    const fileUrls = await handleSupabaseMultipleFileUploads(
      files,
      "bucketName",
      "folderPath",
      (fileIndex, progress) => {
        console.log(`File ${fileIndex + 1} progress: ${progress}%`)
        // Update UI with progress
      }
    )

    return fileUrls
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}
```

## Migrating from AWS S3

The Supabase file upload functionality has been designed to be a drop-in replacement for the previous AWS S3 implementation. The main changes are:

1. Import `handleSupabaseFileUpload` instead of `handleFileUpload`
2. Add bucket name and folder path parameters
3. Optionally add progress tracking

### Example Migration

Before:

```typescript
import { handleFileUpload } from "@/lib/utils"

const fileUrl = await handleFileUpload(file)
```

After:

```typescript
import { handleSupabaseFileUpload } from "@/lib/utils-supabase"

const fileUrl = await handleSupabaseFileUpload(file, "bucketName", "folderPath")
```

## Troubleshooting

### Common Issues

1. **403 Forbidden errors**: Check your bucket policies in Supabase
2. **CORS errors**: Ensure CORS is properly configured in your Supabase project settings
3. **File size limits**: Supabase has a default 50MB file size limit

### Debugging

For debugging upload issues, check the browser console for detailed error messages. The Supabase client provides detailed error information that can help diagnose issues.

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/storage-from-upload)
- [Storage Policies](https://supabase.com/docs/guides/storage/security)
