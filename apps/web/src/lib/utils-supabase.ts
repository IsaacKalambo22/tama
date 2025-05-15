import { uploadFileToSupabase } from "./supabase"

/**
 * Handles file upload to Supabase Storage
 * @param file File to upload
 * @param bucketName Storage bucket name (default: 'uploads')
 * @param folderPath Optional folder path within the bucket
 * @param onProgress Optional progress callback
 * @returns URL of the uploaded file
 */
export const handleSupabaseFileUpload = async (
  file: File,
  bucketName: string = "uploads",
  folderPath: string = "",
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Validate input
    if (!file) {
      throw new Error("No file provided for upload")
    }

    // Upload the file to Supabase Storage with progress tracking
    const fileUrl = await uploadFileToSupabase(
      file,
      bucketName,
      folderPath,
      onProgress
    )

    return fileUrl
  } catch (error) {
    console.error("Error uploading file to Supabase:", error)
    throw new Error("Failed to upload file. Please try again.")
  }
}

/**
 * Handles multiple file uploads to Supabase Storage
 * @param files Array of files to upload
 * @param bucketName Storage bucket name (default: 'uploads')
 * @param folderPath Optional folder path within the bucket
 * @param onProgress Optional progress callback for each file
 * @returns Array of URLs for the uploaded files
 */
export const handleSupabaseMultipleFileUploads = async (
  files: File[],
  bucketName: string = "uploads",
  folderPath: string = "",
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadFileToSupabase(
        file,
        bucketName,
        folderPath,
        onProgress ? (progress) => onProgress(index, progress) : undefined
      )
    )

    const fileUrls = await Promise.all(uploadPromises)
    return fileUrls
  } catch (error) {
    console.error("Error uploading multiple files to Supabase:", error)
    throw new Error("Failed to upload one or more files. Please try again.")
  }
}
