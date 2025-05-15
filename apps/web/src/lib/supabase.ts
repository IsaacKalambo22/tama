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

    // Set up upload options with progress tracking
    const options = {
      cacheControl: "3600",
      upsert: true, // Set to true to overwrite existing files with the same name
    }

    // Create a custom upload with progress tracking
    const uploadWithProgress = async () => {
      // Create a new XMLHttpRequest to handle the upload with progress
      return new Promise<string>((resolve, reject) => {
        // First, get the upload URL from Supabase
        supabase.storage
          .from(bucketName)
          .createSignedUploadUrl(filePath)
          .then(({ data: signedUrlData, error: signedUrlError }) => {
            if (signedUrlError) {
              console.error("Error getting signed URL:", signedUrlError)
              reject(signedUrlError)
              return
            }

            const xhr = new XMLHttpRequest()

            // Set up progress tracking
            if (onProgress) {
              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const percentComplete = (event.loaded / event.total) * 100
                  onProgress(percentComplete)
                }
              }
            }

            // Handle completion
            xhr.onload = async () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                // Get the public URL for the uploaded file
                const { data: publicUrlData } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(filePath)

                resolve(publicUrlData.publicUrl)
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }

            // Handle errors
            xhr.onerror = () => {
              reject(new Error("Network error occurred during upload"))
            }

            // Set up and send the request
            xhr.open("PUT", signedUrlData.signedUrl)
            xhr.setRequestHeader("Content-Type", file.type)
            xhr.setRequestHeader("x-upsert", "true")
            xhr.send(file)
          })
      })
    }

    // Try the custom upload with progress first
    try {
      return await uploadWithProgress()
    } catch (uploadError) {
      console.warn(
        "Custom upload with progress failed, falling back to standard upload:",
        uploadError
      )

      // Fallback to standard upload if the custom method fails
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
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
    }
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
