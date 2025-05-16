"use client"
import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { FileProps } from "@/lib/api"
import { useFileUpload } from "@/hooks/use-file-upload"
import { getFileType } from "@/lib/utils"
import { deleteFileFromSupabase } from "@/lib/supabase"
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
import { updateReportAndPublication } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  file: FileProps
}

const ModalEditReports = ({ isOpen, onClose, file }: Props) => {
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
    filename: zod.string().optional(),
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
    let fileUrl = file.fileUrl || ""
    let type = file.type || ""
    let extension = file.extension || ""
    let size = file.size

    try {
      if (values.files.length > 0) {
        // If there's an existing file, delete it first
        if (file.fileUrl) {
          console.log("Deleting existing file:", file.fileUrl)
          loadingToast = toast.loading("Deleting previous file...")
          
          const deleteResult = await deleteFileFromSupabase(file.fileUrl)
          
          if (loadingToast) {
            toast.dismiss(loadingToast)
          }
          
          if (!deleteResult) {
            console.warn("Failed to delete previous file, continuing with upload")
          } else {
            console.log("Previous file deleted successfully")
          }
        }

        const newFile = values.files[0]
        console.log(
          "Starting upload for file:",
          newFile.name,
          "size:",
          newFile.size,
          "type:",
          newFile.type
        )
        
        // Set uploading state to true to show progress bar
        setIsUploading(true)
        
        // Show toast notification when starting upload
        loadingToast = toast.loading(`Uploading ${newFile.name}...`)
        
        // Upload file to Supabase Storage using our hook
        console.log("Calling uploadFile...")
        const uploadResult = await uploadFile(newFile).catch((error) => {
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
        toast.success(`${newFile.name} uploaded successfully`)
        
        // Update file information with the new file data
        fileUrl = uploadResult.url
        size = Number(newFile.size)
        const fileProps = getFileType(newFile.name)
        type = fileProps.type
        extension = fileProps.extension
      }

      const payload = {
        filename: values.filename ?? "",
        fileUrl,
        type,
        extension,
        size,
      }

      const result = await updateReportAndPublication(
        payload,
        file.id,
        fullPath,
        pathWithoutAdmin
      )

      onClose()
      if (result.success) {
        toast.success("Publication updated successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error updating publication:", error)
      
      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }
      
      // Reset upload state
      setIsUploading(false)
      
      // Show detailed error message
      toast.error("Failed to update publication", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${file.filename}`}>
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
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
                  />
                </FormControl>
                {file.fileUrl && !field.value?.length && (
                  <div className="mt-2 text-sm">
                    <p>
                      Current file:{" "}
                      <span className="font-medium">
                        {file.fileUrl.split("/").pop()}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upload a new file to replace the current one
                    </p>
                  </div>
                )}
              </div>
            )}
          />

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

export default ModalEditReports
