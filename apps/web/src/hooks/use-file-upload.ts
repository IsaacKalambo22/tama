import { supabase } from "@/lib/supabase"
import { useState } from "react"

export type UploadStatus = "idle" | "uploading" | "success" | "error"

export type UploadProgress = {
  progress: number
  loaded: number
  total: number
}

export type UploadResult = {
  path: string
  url: string
}

export type UseFileUploadOptions = {
  bucketName?: string
  path?: string
  cacheControl?: string
  upsert?: boolean
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_NAME! as string,
    path = "",
    cacheControl = "3600",
    upsert = false,
  } = options

  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    loaded: 0,
    total: 0,
  })
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const reset = () => {
    setStatus("idle")
    setProgress({ progress: 0, loaded: 0, total: 0 })
    setResult(null)
    setError(null)
  }

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    try {
      console.log("useFileUpload: Starting upload process for", file.name)
      setStatus("uploading")
      setProgress({ progress: 0, loaded: 0, total: file.size })
      setError(null)

      // Create a unique file name if path is not provided
      const timestamp = Date.now()
      const safeFileName = file.name.replace(/\s+/g, "_")
      const filePath = path
        ? `${path}/${timestamp}_${safeFileName}`
        : `${timestamp}_${safeFileName}`

      console.log("useFileUpload: Generated file path:", filePath)

      // For progress tracking, we need to use XMLHttpRequest
      // since the Supabase client doesn't support progress tracking directly
      console.log(
        "useFileUpload: Requesting signed URL from Supabase bucket:",
        bucketName
      )
      return new Promise((resolve, reject) => {
        console.log(
          "useFileUpload: Requesting signed URL from Supabase bucket:",
          bucketName
        )

        // First, get a signed URL for the file upload
        supabase.storage
          .from(bucketName)
          .createSignedUploadUrl(filePath)
          .then(({ data, error }) => {
            if (error) {
              console.error("useFileUpload: Error creating signed URL:", error)
              reject(error)
              return
            }

            if (!data) {
              const noDataError = new Error(
                "Failed to create signed URL - no data returned"
              )
              console.error("useFileUpload:", noDataError)
              reject(noDataError)
              return
            }

            console.log("useFileUpload: Successfully obtained signed URL", data)

            // Correctly extract the signedUrl from data
            const { signedUrl } = data

            // Use XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const progressData = {
                  progress: (event.loaded / event.total) * 100,
                  loaded: event.loaded,
                  total: event.total,
                }
                console.log(
                  `useFileUpload: Upload progress - ${Math.round(progressData.progress)}%`
                )
                setProgress(progressData)
              }
            })

            xhr.addEventListener("load", async () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                console.log(
                  "useFileUpload: Upload successful, getting public URL"
                )
                // Get public URL for the uploaded file
                const { data: publicUrlData } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(filePath) // Use filePath instead of path

                if (!publicUrlData) {
                  const noUrlError = new Error(
                    "Failed to get public URL after upload"
                  )
                  console.error("useFileUpload:", noUrlError)
                  setStatus("error")
                  setError(noUrlError)
                  reject(noUrlError)
                  return
                }

                const result = {
                  path: filePath, // Use filePath instead of path
                  url: publicUrlData.publicUrl,
                }

                console.log("useFileUpload: Upload complete, URL:", result.url)
                setStatus("success")
                setResult(result)
                resolve(result)
              } else {
                const error = new Error(
                  `Upload failed with status ${xhr.status}`
                )
                console.error("useFileUpload: HTTP error during upload:", error)
                setStatus("error")
                setError(error)
                reject(error)
              }
            })

            xhr.addEventListener("error", (event) => {
              const error = new Error("Network error during upload")
              console.error(
                "useFileUpload: Network error during upload:",
                event
              )
              setStatus("error")
              setError(error)
              reject(error)
            })

            xhr.addEventListener("abort", () => {
              const error = new Error("Upload aborted")
              console.warn("useFileUpload: Upload aborted")
              setStatus("error")
              setError(error)
              reject(error)
            })

            // Open and send the request
            try {
              console.log("useFileUpload: Sending file to signed URL")
              xhr.open("PUT", signedUrl)
              xhr.setRequestHeader("Content-Type", file.type)
              xhr.setRequestHeader("Cache-Control", cacheControl)
              xhr.send(file)
            } catch (xhrError) {
              console.error(
                "useFileUpload: Error setting up XHR request:",
                xhrError
              )
              reject(
                xhrError instanceof Error
                  ? xhrError
                  : new Error(String(xhrError))
              )
            }
          })
          .catch((error) => {
            setStatus("error")
            setError(error instanceof Error ? error : new Error(String(error)))
            reject(error)
            return null
          })
      })
    } catch (error) {
      console.error("useFileUpload: Caught error in uploadFile:", error)
      setStatus("error")
      setError(error instanceof Error ? error : new Error(String(error)))
      throw error // Re-throw to allow for better error handling in the component
    }
  }

  return {
    uploadFile,
    status,
    progress,
    result,
    error,
    reset,
  }
}
