# Supabase Integration Analysis - TAMA Farmers Trust

## Overview

The TAMA Farmers Trust system uses Supabase primarily for **file storage** rather than database operations or authentication. The system maintains a separate API backend with PostgreSQL/Prisma for data management.

## Configuration & Setup

### Environment Variables

**Development (`.env`)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tmeaxzldethzzemzsosu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZWF4emxkZXRoenplbXpzb3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzQ0NjMsImV4cCI6MjA2NDQ1MDQ2M30.OXlJisOW83inoVF5JDuKJ_jJKLVH8pUFk-pHrrtlaHU
NEXT_PUBLIC_SUPABASE_STORAGE_NAME=tama
```

**Production (`.env.prod`)**:
```env
# [Same structure as development with production values]
```

### Client Initialization

**File**: `/apps/web/src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## Key Integration Points

### 1. File Storage Operations

**Primary Use Case**: Upload/delete files for admin content management

**Core Functions** (`/apps/web/src/lib/supabase.ts`):

#### `uploadFileToSupabase()`
- Handles file upload with progress tracking
- Supports custom bucket names and folder paths
- Generates unique filenames with timestamps
- Provides fallback upload method

```typescript
export const uploadFileToSupabase = async (
  file: File,
  bucketName: string = "uploads",
  folderPath: string = "",
  onProgress?: (progress: number) => void
): Promise<string>
```

#### `deleteFileFromSupabase()`
- Deletes files from Supabase Storage
- Handles different URL formats (full URLs, relative paths)
- Extracts file paths from URLs automatically

```typescript
export const deleteFileFromSupabase = async (
  filePath: string
): Promise<boolean>
```

### 2. Utility Wrapper Functions

**File**: `/apps/web/src/lib/utils-supabase.ts`

#### `handleSupabaseFileUpload()`
- Wrapper around `uploadFileToSupabase()` with error handling
- Input validation and user-friendly error messages

#### `handleSupabaseMultipleFileUploads()`
- Batch file upload functionality
- Parallel upload processing with Promise.all()

### 3. React Hook Integration

**File**: `/apps/web/src/hooks/use-file-upload.ts`

- Custom hook for file upload operations
- Integrates with Supabase storage API
- Provides progress tracking and error handling
- Used throughout admin interfaces

### 4. Admin Module Integration

**Files using Supabase**:
- Shop management modals (`/apps/web/src/modules/admin/shop/`)
- Blog/news content management (`/apps/web/src/modules/admin/blog/`, `/apps/web/src/modules/admin/news/`)
- Team member profiles (`/apps/web/src/modules/admin/team/`)
- Document management (`/apps/web/src/modules/admin/forms-documents/`)
- Home carousel and image-text sections (`/apps/web/src/modules/admin/home-carousel/`, `/apps/web/src/modules/admin/home-image-text/`)
- Reports and publications (`/apps/web/src/modules/admin/reports-publications/`)
- Council list management (`/apps/web/src/modules/admin/council-list/`)
- Services management (`/apps/web/src/modules/admin/services/`)

## Architecture Pattern

### Storage-Only Integration

```
Frontend (Next.js) → Supabase Storage ← API Backend (Separate)
                      ↓
                 File Upload/Delete
```

### No Database/Auth Usage

- **Database**: Uses separate PostgreSQL with Prisma via API backend
- **Authentication**: Uses NextAuth.js with custom implementation
- **Supabase Auth**: Not utilized
- **Supabase Database**: Not used for application data

## Storage Buckets

### Configured Buckets
1. **`uploads`** - General purpose uploads
2. **`shops`** - Shop images
3. **`tama`** - Default bucket (from `NEXT_PUBLIC_SUPABASE_STORAGE_NAME`)

### Bucket Usage Patterns

```typescript
// Example usage in admin components
const fileUrl = await handleSupabaseFileUpload(
  file,
  "shops",           // Bucket name
  "shop-images",     // Folder path
  (progress) => setUploadProgress(progress)
)
```

## File Operations Flow

### Upload Process

1. **File Selection**: File selected in admin interface
2. **Upload Initiation**: `handleSupabaseFileUpload()` called with bucket/folder
3. **Filename Generation**: Unique filename generated with timestamp
4. **Storage Upload**: Upload to Supabase Storage with progress tracking
5. **URL Generation**: Public URL returned and stored in API database

### Delete Process

1. **URL Input**: File URL passed to `deleteFileFromSupabase()`
2. **Path Extraction**: URL parsed to extract file path
3. **Storage Deletion**: File removed from Supabase Storage
4. **Database Update**: Database record updated via API

## Security & Permissions

### Storage Policies

**Documented in**: `/apps/web/src/lib/README-supabase.md`

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

### Access Control

- Uses anonymous key for client-side operations
- File operations restricted to admin/manager roles in API
- No direct database access from frontend
- CORS configuration required in Supabase project settings

## Dependencies

### Package Dependencies

**File**: `/apps/web/package.json`

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.52.0"
  }
}
```

### Import Structure

```
supabase.ts (core client)
├── utils-supabase.ts (wrapper functions)
└── hooks/use-file-upload.ts (React integration)
```

## File Structure

```
apps/web/src/
├── lib/
│   ├── supabase.ts              # Core Supabase client and storage functions
│   ├── utils-supabase.ts        # Wrapper functions with error handling
│   └── README-supabase.md       # Setup and usage documentation
├── hooks/
│   └── use-file-upload.ts       # React hook for file operations
└── modules/admin/
    ├── shop/                    # Shop image management
    ├── blog/                    # Blog content with images
    ├── news/                    # News content with images
    ├── team/                    # Team member photos
    ├── forms-documents/         # Document file management
    ├── home-carousel/           # Carousel images
    ├── home-image-text/         # Home section images
    ├── reports-publications/    # Report files
    ├── council-list/            # Council member photos
    └── services/                # Service images
```

## Migration from AWS S3

The system migrated from AWS S3 to Supabase Storage. Key changes:

### Before (AWS S3):
```typescript
import { handleFileUpload } from "@/lib/utils"
const fileUrl = await handleFileUpload(file)
```

### After (Supabase):
```typescript
import { handleSupabaseFileUpload } from "@/lib/utils-supabase"
const fileUrl = await handleSupabaseFileUpload(file, "bucketName", "folderPath")
```

## Troubleshooting

### Common Issues

1. **403 Forbidden errors**: Check bucket policies in Supabase dashboard
2. **CORS errors**: Ensure CORS is properly configured in Supabase project settings
3. **File size limits**: Supabase has a default 50MB file size limit
4. **URL parsing errors**: Verify file path extraction logic in delete operations

### Debugging

- Check browser console for detailed error messages
- Verify environment variables are correctly set
- Ensure bucket policies allow required operations
- Test with smaller files to rule out size limitations

## Configuration Files Summary

| File | Purpose | Key Content |
|------|---------|-------------|
| `.env` | Environment variables | Supabase URL, anon key, storage name |
| `supabase.ts` | Client initialization | Supabase client, upload/delete functions |
| `utils-supabase.ts` | Utility wrappers | Error handling, batch operations |
| `use-file-upload.ts` | React integration | Custom hook for file operations |
| `README-supabase.md` | Documentation | Setup instructions, usage examples |

## Integration Statistics

- **42 files** contain Supabase references
- **3 core files** for Supabase functionality
- **184 total matches** across the codebase
- **Primary usage**: Admin content management interfaces
- **No database operations** using Supabase
- **No authentication** through Supabase Auth

## Best Practices

1. **Use specific bucket names** for different content types
2. **Implement progress tracking** for better UX
3. **Handle URL parsing** carefully for delete operations
4. **Set appropriate storage policies** for security
5. **Monitor file sizes** to avoid upload limits
6. **Use meaningful folder structures** within buckets

## Future Considerations

1. **Database Integration**: Consider using Supabase Database for simpler applications
2. **Auth Integration**: Evaluate Supabase Auth for unified authentication
3. **Real-time Features**: Leverage Supabase real-time subscriptions
4. **Edge Functions**: Consider Supabase Edge Functions for serverless operations
5. **Backup Strategy**: Implement proper backup policies for uploaded files

---

**Last Updated**: May 4, 2026  
**Analysis Scope**: Complete codebase review of Supabase integration  
**Primary Use Case**: File storage for admin content management
