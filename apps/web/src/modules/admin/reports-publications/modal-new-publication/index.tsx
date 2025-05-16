"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { getFileType } from "@/lib/utils"
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
import { createReportAndPublication } from "../../actions"
type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const ModalNewPublication = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  // Initialize the file upload hook
  const {
    uploadFile,
    status: uploadStatus,
    progress: uploadProgress,
    result: uploadResult,
    error: uploadError,
  } = useFileUpload({
    path: "reports-publications",
  })
  const formSchema = zod.object({
    filename: zod.string().min(2, {
      message: "Filename must be at least 2 characters.",
    }),
    files: zod.custom<File[]>(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: "",
      files: [],
    },
  })
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | number | undefined

    try {
      if (!values.files.length) {
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

      const fileProps = getFileType(file.name)
      console.log({ fileProps })

      // Create a JSON object to send
      const payload = {
        filename: values.filename,
        size: file.size,
        extension: fileProps.extension,
        type: fileProps.type,
        fileUrl: uploadResult.url,
      }

      // Call the createReportAndPublication function to send data to the server
      const result = await createReportAndPublication(
        payload,
        fullPath,
        pathWithoutAdmin,
        "/admin"
      )

      onClose()
      if (result.success) {
        toast.success("Publication created successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error creating publication:", error)

      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Reset upload state
      setIsUploading(false)

      // Show detailed error message
      toast.error("Failed to create publication", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Report or Publication</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-5 w-full max-w-[400px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="filename"
              label="Name"
              control={form.control}
              placeholder="Enter report name"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="files"
              label="File"
              renderSkeleton={(field) => (
                <div>
                  <FormControl>
                    <FileUploader
                      files={field.value}
                      onChange={field.onChange}
                      uploadProgress={uploadProgress}
                      uploadStatus={uploadStatus}
                      isUploading={isUploading}
                      allowedTypes={["application/pdf"]}
                      maxSizeMB={10}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only PDF files are allowed (max 10MB)
                  </p>
                </div>
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
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalNewPublication
