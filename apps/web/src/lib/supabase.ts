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
  filePath: string
): Promise<boolean> => {
  try {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME!

    console.log("deleteFileFromSupabase: bucketName", bucketName)
    console.log("deleteFileFromSupabase: original filePath", filePath)

    // Handle different URL formats
    let path = filePath

    // If it's a full URL, extract the path
    if (filePath.startsWith("http")) {
      try {
        const url = new URL(filePath)
        // Extract path from URL - remove the domain and bucket name
        const urlPath = url.pathname
        // Remove leading slash and bucket name
        path = urlPath.replace(`/${bucketName}/`, "").replace(/^\//, "")
        console.log("deleteFileFromSupabase: extracted path from URL", path)
      } catch (urlError) {
        console.error("deleteFileFromSupabase: Error parsing URL", urlError)
        return false
      }
    } else if (filePath.includes("/")) {
      // If it contains slashes but is not a full URL, try to extract path
      const parts = filePath.split("/")
      // Find the bucket name in the path and get everything after it
      const bucketIndex = parts.findIndex((part) => part === bucketName)
      if (bucketIndex !== -1) {
        path = parts.slice(bucketIndex + 1).join("/")
        console.log(
          "deleteFileFromSupabase: extracted path from path with bucket",
          path
        )
      }
    }

    console.log("deleteFileFromSupabase: final path to delete", path)

    if (!path || path.trim() === "") {
      console.error("deleteFileFromSupabase: No valid path found")
      return false
    }

    const { error } = await supabase.storage.from(bucketName).remove([path])

    if (error) {
      console.error(
        "deleteFileFromSupabase: Error deleting file from Supabase:",
        error
      )
      return false
    }

    console.log("deleteFileFromSupabase: File deleted successfully")
    return true
  } catch (error) {
    console.error(
      "deleteFileFromSupabase: Error in deleteFileFromSupabase:",
      error
    )
    return false
  }
}
