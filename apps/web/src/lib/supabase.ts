import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Upload a file to Supabase Storage
 * @param file File to upload
 * @param bucketName Storage bucket name
 * @param folderPath Optional folder path within the bucket
 * @param onProgress Optional progress callback
 * @returns URL of the uploaded file
 */
export const uploadFileToSupabase = async (
  file: File,
  bucketName: string = "uploads",
  folderPath: string = "",
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Create a unique file name to avoid collisions
    const timestamp = new Date().getTime()
    const fileExtension = file.name.split(".").pop()
    const uniqueFileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`

    // Construct the full path including any folder structure
    const filePath = folderPath
      ? `${folderPath}/${uniqueFileName}`
      : uniqueFileName

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        onUploadProgress: onProgress
          ? (progress) => {
              const percent = (progress.loaded / progress.total) * 100
              onProgress(percent)
            }
          : undefined,
      })

    if (error) {
      console.error("Error uploading file to Supabase:", error)
      throw error
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error in uploadFileToSupabase:", error)
    throw error
  }
}

/**
 * Delete a file from Supabase Storage
 * @param filePath Path of the file to delete
 * @param bucketName Storage bucket name
 * @returns Boolean indicating success
 */
export const deleteFileFromSupabase = async (
  filePath: string,
  bucketName: string = "uploads"
): Promise<boolean> => {
  try {
    // Extract the file path from the full URL if needed
    const path = filePath.includes("/")
      ? filePath.split(`${bucketName}/`)[1]
      : filePath

    const { error } = await supabase.storage.from(bucketName).remove([path])

    if (error) {
      console.error("Error deleting file from Supabase:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteFileFromSupabase:", error)
    return false
  }
}
