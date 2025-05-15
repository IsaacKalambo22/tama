"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"

import { UploadProgress } from "@/hooks/use-file-upload"

interface FileUploaderProps {
  /**
   * Currently selected files
   */
  files: File[] | undefined
  /**
   * Callback when files change
   */
  onChange: (files: File[]) => void
  /**
   * Maximum file size in MB (default: 5)
   */
  maxSizeMB?: number
  /**
   * Allowed file types (MIME types)
   * Default: ["image/jpeg", "image/png", "image/gif"]
   * Examples: ["application/pdf"] for PDFs, ["text/csv"] for CSV files
   */
  allowedTypes?: string[]
  /**
   * Storage bucket name
   */
  /**
   * Upload progress information
   */
  uploadProgress?: UploadProgress
  /**
   * Current upload status message
   */
  uploadStatus?: string
  /**
   * Whether a file is currently being uploaded
   */
  isUploading?: boolean
}

export const FileUploader = ({
  files,
  onChange,
  maxSizeMB = 5,
  allowedTypes = ["image/**"],
  uploadProgress = { progress: 0, loaded: 0, total: 0 },
  uploadStatus = "",
  isUploading = false,
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Initialize the file from props if available
  useState(() => {
    if (files && files.length > 0 && !selectedFile) {
      setSelectedFile(files[0])
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) return

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const error = new Error(`File size exceeds ${maxSizeMB}MB limit`)
      toast.error("File too large", {
        description: error.message,
      })
      return
    }

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const error = new Error(`File type ${file.type} is not allowed`)
      toast.error("Unsupported file type", {
        description: error.message,
      })
      return
    }

    setSelectedFile(file)
    onChange([file])
    toast.info("File selected", {
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    })
  }

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  const handleReset = () => {
    setSelectedFile(null)
    onChange([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0] || null
      if (!file) return

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        const error = new Error(`File size exceeds ${maxSizeMB}MB limit`)
        toast.error("File too large", {
          description: error.message,
        })
        return
      }

      // Validate file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        const error = new Error(`File type ${file.type} is not allowed`)
        toast.error("Unsupported file type", {
          description: error.message,
        })
        return
      }

      setSelectedFile(file)
      onChange([file])
      toast.info("File selected", {
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
      })
    },
    [allowedTypes, maxSizeMB, onChange]
  )

  return (
    <div className="w-full max-h-[15rem] space-y-2">
      <div
        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"} rounded-lg transition-colors duration-200`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={allowedTypes.join(",")}
        />

        {!selectedFile ? (
          <div
            className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center"
            onClick={handleSelectFile}
          >
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Drag and drop files here, or click anywhere to select
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <div className="truncate max-w-[200px]">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                  {selectedFile.type.split("/")[1]}
                </p>
              </div>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                disabled={isUploading}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>
                    {uploadProgress?.progress
                      ? `${Math.round(uploadProgress.progress)}%`
                      : "0%"}
                  </span>
                </div>
                <Progress value={uploadProgress?.progress} className="h-1.5" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
