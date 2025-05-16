"use client"
import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { NewsProps } from "@/lib/api"
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
import { updateNews } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  news: NewsProps
}

const ModalEditNews = ({ isOpen, onClose, news }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)
  const formSchema = zod.object({
    title: zod.string().optional(),
    content: zod.string().optional(),
    author: zod.string().optional(),
    files: zod.custom<File[]>(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
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
    path: "news",
  })

  // State to track if we're currently uploading a file
  const [isUploading, setIsUploading] = useState(false)
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | undefined

    try {
      let imageUrl = news.imageUrl || ""
      let size = news.size

      // Check if a new file is being uploaded
      if (values.files && values.files.length > 0) {
        const file = values.files[0]
        console.log(
          "Starting upload for file:",
          file.name,
          "size:",
          file.size,
          "type:",
          file.type
        )

        // If there's an existing image, delete it first
        if (news.imageUrl) {
          console.log("Deleting existing file:", news.imageUrl)
          loadingToast = toast.loading("Deleting previous image...")

          const deleteResult = await deleteFileFromSupabase(news.imageUrl)

          if (loadingToast) {
            toast.dismiss(loadingToast)
          }

          if (!deleteResult) {
            console.warn(
              "Failed to delete previous image, continuing with upload"
            )
          } else {
            console.log("Previous image deleted successfully")
          }
        }

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

        // Get the file URL from the uploadResult
        imageUrl = uploadResult.url
        size = file.size

        console.log("File uploaded to Supabase. URL:", imageUrl)
      }

      const payload = {
        title: values.title ?? "",
        content: values.content ?? "",
        author: values.author ?? "",
        imageUrl,
        size,
      }

      const result = await updateNews(
        payload,
        news.id,
        fullPath,
        "/news-updates-news"
      )

      onClose()
      if (result.success) {
        toast.success("News updated successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error updating news:", error)

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
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${news.title}`}>
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
            name="content"
            label="Content"
            control={form.control}
            placeholder="Enter content"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="author"
            label="Author"
            control={form.control}
            placeholder="Enter author"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="files"
            label="Image"
            renderSkeleton={(field) => (
              <div>
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
                {news.imageUrl && !field.value?.length && (
                  <div className="mt-2 text-sm">
                    <p>
                      Current image:{" "}
                      <span className="font-medium">
                        {news.imageUrl.split("/").pop()}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upload a new image to replace the current one
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

export default ModalEditNews
