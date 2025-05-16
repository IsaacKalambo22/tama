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
import { CouncilListProps } from "@/lib/api"
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
import { createCouncilList } from "../../actions"

type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const ModalNewCouncilList = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  
  // State to track if we're currently uploading a file
  const [isUploading, setIsUploading] = useState(false)
  
  // Initialize the file upload hook
  const {
    uploadFile,
    status: uploadStatus,
    progress: uploadProgress,
    result: uploadResult,
    error: uploadError,
  } = useFileUpload({
    path: "council-list",
  })

  const formSchema = zod.object({
    demarcation: zod.string().min(2, {
      message: "Demarcation must be at least 2 characters.",
    }),
    councilArea: zod.string().min(2, {
      message: "Council area must be at least 2 characters.",
    }),
    council: zod.string().min(2, {
      message: "Councillor must be at least 2 characters.",
    }),
    firstAlternateCouncillor: zod.string().min(2, {
      message: "First Alternate Councillor must be at least 2 characters.",
    }),
    secondAlternateCouncillor: zod.string().min(2, {
      message: "Second Alternate Councillor must be at least 2 characters.",
    }),
    files: zod.custom<File[]>(),
  })

  const path = usePathname()
  const { fullPath } = useCustomPath(path)

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demarcation: "",
      councilArea: "",
      council: "",
      firstAlternateCouncillor: "",
      secondAlternateCouncillor: "",
      files: [],
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | undefined
    let imageUrl: string | null = ""
    
    try {
      // Check if a new file is being uploaded
      if (values.files && values.files.length > 0) {
        // Get the file to upload
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

        // Get the file URL from the uploadResult
        imageUrl = uploadResult.url
      }

      const payload = {
        demarcation: values.demarcation,
        councilArea: values.councilArea,
        council: values.council,
        firstAlternateCouncillor: values.firstAlternateCouncillor,
        secondAlternateCouncillor: values.secondAlternateCouncillor,
        imageUrl,
      }
      console.log({ payload })

      const result = await createCouncilList(
        payload,
        fullPath,
        "/resources/council-list",
        "/admin"
      )

      onClose()

      if (result.success) {
        toast.success("Council list created successfully")
      } else {
        toast.error(
          result.error ?? "An error occurred while creating council list."
        )
      }
    } catch (error) {
      console.error("Error creating council list:", error)
      
      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Reset upload state
      setIsUploading(false)

      // Show detailed error message
      toast.error("Failed to create council list", {
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
          <DialogTitle>Add New Council List</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-5 w-full max-w-[400px]"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="councilArea"
              label="Council area"
              control={form.control}
              placeholder="Enter council area"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="demarcation"
              label="Demarcation"
              control={form.control}
              placeholder="Enter demarcation"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="council"
              label="Council"
              control={form.control}
              placeholder="Enter council"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="firstAlternateCouncillor"
              label="First alternate council"
              control={form.control}
              placeholder="Enter first alternate council"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="secondAlternateCouncillor"
              label="Second alternate council"
              control={form.control}
              placeholder="Enter second alternate council"
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
                </div>
              )}
            />

            <SubmitButton
              disabled={isLoading || !form.formState.isValid}
              isLoading={isLoading}
              className="w-full h-9"
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

export default ModalNewCouncilList