"use client"
import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { deleteFileFromSupabase } from "@/lib/supabase-storage"
import { handleFileUploads, updateFileProgress } from "@/lib/utils"
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
import { updateHomeImageText } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  homeImageText: HomeImageText
}

const ModalEditHomeImageText = ({ isOpen, onClose, homeImageText }: Props) => {
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
    path: "home-image-text",
  })

  // State to track if we're currently uploading a file
  const [isUploading, setIsUploading] = useState(false)

  const formSchema = zod.object({
    heading: zod
      .string()
      .min(2, {
        message: "Heading must be at least 2 characters.",
      })
      .optional(),
    description: zod
      .string()
      .min(2, {
        message: "Description must be at least 2 characters.",
      })
      .optional()
      .or(zod.literal("")), // Allows empty strings to prevent validation errors
  })

  // Set initial form default values from the `homeImageText` prop
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      heading: homeImageText.heading || "",
      description: homeImageText.description || "",
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | undefined

    try {
      let imageUrl = homeImageText.imageUrl || ""

      // Check if a new file is being uploaded
      if (fileStates.length > 0) {
        // Set uploading state to true to show progress bar
        setIsUploading(true)

        // Show toast notification when starting upload
        const file = fileStates[0].file
        loadingToast = toast.loading(`Uploading ${file.name}...`)

        // If there's an existing image, delete it first from Supabase
        if (homeImageText.imageUrl) {
          await deleteFileFromSupabase(homeImageText.imageUrl)
        }

        // Upload all files using the existing MultiFileDropzone component's approach
        const imageUrls = await Promise.all(
          fileStates.map(async (fileState) =>
            handleFileUploads(fileState.file, (progress) =>
              updateFileProgress(fileState.key, progress, setFileStates)
            )
          )
        )
        imageUrl = imageUrls[0]

        // Set uploading state to false after upload completes
        setIsUploading(false)

        // Dismiss the loading toast if it exists
        if (loadingToast) {
          toast.dismiss(loadingToast)
        }

        // Show success toast when upload completes
        toast.success(`Files uploaded successfully`)
      }

      // Create a JSON object to send
      const payload = {
        heading: values.heading,
        description: values.description,
        imageUrl,
      }

      const result = await updateHomeImageText(
        payload,
        homeImageText.id,
        fullPath,
        "/admin"
      )

      onClose()
      if (result.success) {
        toast.success("Home image text updated successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error updating home image text:", error)

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
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit HomeImageText`}>
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="heading"
            label="Heading"
            control={form.control}
            placeholder="Enter heading"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="description"
            label="Description"
            control={form.control}
            placeholder="Enter description"
          />

          <div className="w-full flex flex-col gap-3">
            <label className="font-medium text-gray-700">Upload Images</label>
            <MultiFileDropzone
              value={fileStates}
              onChange={setFileStates}
              fileType="image/*"
              maxFiles={3}
            />
          </div>
          <SubmitButton
            disabled={isLoading || !form.formState.isValid}
            isLoading={isLoading}
            className="w-full  h-9"
            loadingText="Updating..."
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default ModalEditHomeImageText
