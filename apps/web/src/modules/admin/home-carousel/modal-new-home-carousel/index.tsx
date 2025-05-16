"use client"

import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { getFileType } from "@/lib/utils"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import {
  FileState,
  MultiFileDropzone,
} from "@/modules/common/multiple-file-upload"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as zod from "zod"
import { createHomeCarousel } from "../../actions"
import Modal from "../../modal"
type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const ModalNewHomeCarousel = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const [fileStates, setFileStates] = useState<FileState[]>([])

  // Initialize the file upload hook
  const {
    uploadFile,
    status: uploadStatus,
    progress: uploadProgress,
    result: uploadResult,
    error: uploadError,
  } = useFileUpload({
    path: "home-carousel",
  })

  // State to track if we're currently uploading a file
  const [isUploading, setIsUploading] = useState(false)

  const formSchema = zod.object({
    title: zod.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: zod.string().min(2, {
      message: "Description must be at least 2 characters.",
    }),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  })
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | undefined

    try {
      if (fileStates.length === 0) {
        toast.error("Please upload at least one image file.")
        setIsLoading(false) // Stop the loading process
        return
      }

      // Set uploading state to true to show progress bar
      setIsUploading(true)

      // Show toast notification when starting upload
      const file = fileStates[0].file
      loadingToast = toast.loading(`Uploading ${file.name}...`)

      // Upload files using Supabase
      const uploadedImageUrls = await Promise.all(
        fileStates.map(async (fileState) => {
          // Upload file to Supabase Storage using our hook
          console.log("Uploading file:", fileState.file.name)
          const result = await uploadFile(fileState.file).catch((error) => {
            console.error("Error during file upload:", error)
            throw new Error(`Upload failed: ${error.message || "Unknown error"}`)
          })
          
          if (!result) {
            throw new Error("File upload failed - no result returned")
          }
          
          // Update progress in UI
          setFileStates(currentFileStates => {
            return currentFileStates.map(fs => {
              if (fs.key === fileState.key) {
                return {
                  ...fs,
                  progress: 100
                }
              }
              return fs
            })
          })
          
          return result.url
        })
      )

      // Set uploading state to false after upload completes
      setIsUploading(false)

      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Show success toast when upload completes
      toast.success(`Files uploaded successfully`)

      // Create a JSON object to send
      const payload = {
        title: values.title,
        description: values.description,
        coverUrl: uploadedImageUrls[0],
      }
      console.log({ payload })

      const result = await createHomeCarousel(payload, fullPath, "/admin", "/")

      onClose()
      if (result.success) {
        toast.success("New home carousel created successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error creating home carousel:", error)

      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Reset upload state
      setIsUploading(false)

      // Show detailed error message
      toast.error("Failed to process your request", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Add New HomeCarousel">
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="title"
            label="Title"
            control={form.control}
            placeholder="Enter title"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="description"
            label="Description"
            control={form.control}
            placeholder="Enter description"
          />

          <div className="w-full flex flex-col gap-4">
            <label className="font-medium text-gray-700">Upload Image</label>
            <MultiFileDropzone
              value={fileStates}
              onChange={setFileStates}
              fileType="image/*"
              maxFiles={1}
            />
          </div>

          <SubmitButton
            disabled={isLoading || !form.formState.isValid}
            isLoading={isLoading}
            className="w-full  h-9"
            loadingText="Saving..."
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default ModalNewHomeCarousel
