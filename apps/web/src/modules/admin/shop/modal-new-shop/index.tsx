"use client"

import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import config from "@/lib/config"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import { FileUploader } from "@/modules/common/file-uploader"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as zod from "zod"
import { createShop } from "../../actions"
import Modal from "../../modal"
type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const ModalNewShop = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const formSchema = zod.object({
    name: zod.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    address: zod.string().min(2, {
      message: "Address must be at least 2 characters.",
    }),
    openHours: zod.string().min(2, {
      message: "OpenHours must be at least 2 characters.",
    }),
    files: zod.custom<File[]>(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      openHours: "",
      files: [],
    },
  })

  // Initialize the file upload hook
  const {
    uploadFile,
    status: uploadStatus,
    progress: uploadProgress,
    result: uploadResult,
    error: uploadError,
  } = useFileUpload({
    bucketName: config.env.supabase.bucketName,
    path: "shops",
  })

  // State to track if we're currently uploading a file
  const [isUploading, setIsUploading] = useState(false)

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | undefined

    try {
      // Validate file exists
      if (!values.files || values.files.length === 0) {
        throw new Error("Please select a file to upload")
      }

      const file = values.files[0]
      console.log(
        "Starting upload for file:",
        file.name,
        "size:",
        file.size,
        "type:",
        file.type
      )

      // Set uploading state to true to show progress bar
      setIsUploading(true)

      // Show toast notification when starting upload
      loadingToast = toast.loading(`Uploading ${file.name}...`)
      // Log Supabase bucket information
      console.log("Using Supabase bucket:", config.env.supabase.bucketName)

      // Upload file to Supabase Storage using our hook
      console.log("Calling uploadFile...")
      const uploadResult = await uploadFile(file).catch((error) => {
        console.error("Error during file upload:", error)
        throw new Error(`Upload failed: ${error.message || "Unknown error"}`)
      })
      console.log("Upload completed, result:", uploadResult)

      // Set uploading state to false after upload completes
      setIsUploading(false)

      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      if (!uploadResult) {
        throw new Error("File upload failed - no result returned")
      }

      // Show success toast when upload completes
      toast.success(`${file.name} uploaded successfully`)

      // Get the file URL from the uploadResult
      const fileUrl = uploadResult.url

      console.log("File uploaded to Supabase. URL:", fileUrl)

      // Create a JSON object to send
      const payload = {
        name: values.name,
        openHours: values.openHours,
        address: values.address,
        imageUrl: fileUrl, // Add the uploaded file URL
        size: file.size, // Add the file size
      }

      const result = await createShop(
        payload,
        fullPath,
        `/tobacco-business/shops`,
        "/admin"
      )

      onClose()
      if (result.success) {
        toast.success("Shop created successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error creating shop:", error)

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
    <Modal isOpen={isOpen} onClose={onClose} name="Add New Shop">
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Name"
            control={form.control}
            placeholder="Enter shop name"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            control={form.control}
            placeholder="Enter address"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="openHours"
            label="Open Hours"
            control={form.control}
            placeholder="Enter shop open hours"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="files"
            label="Image"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  files={field.value}
                  onChange={(files) => {
                    field.onChange(files)
                  }}
                  uploadProgress={uploadProgress}
                  uploadStatus={uploadStatus}
                  isUploading={isUploading}
                />
              </FormControl>
            )}
          />
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

export default ModalNewShop
