"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { toast } from "@/hooks/use-toast"
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
import * as zod from "zod"
import { createTeam } from "../../actions"
type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fileStates, setFileStates] = useState<FileState[]>([])

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
    path: "team",
  })

  // State to track if we're currently uploading a file
  const [isUploading, setIsUploading] = useState(false)
  const formSchema = zod.object({
    name: zod.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: zod.string().min(2, {
      message: "Content must be at least 2 characters.",
    }),
    position: zod.string().min(2, {
      message: "Author must be at least 2 characters.",
    }),
    facebookUrl: zod.string().optional(),
    linkedInProfile: zod.string().optional(),
    twitterUrl: zod.string().optional(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      position: "",
      facebookUrl: "",
      linkedInProfile: "",
      twitterUrl: "",
    },
  })
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: string | undefined

    try {
      if (fileStates.length === 0) {
        toast({
          title: "Error",
          description: "Please upload an image for the team member",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Set uploading state to true to show progress bar
      setIsUploading(true)

      // Show toast notification when starting upload
      const file = fileStates[0].file
      loadingToast = toast({
        title: "Uploading",
        description: `Uploading ${file.name}...`,
        variant: "default",
      }).id

      // Upload files using Supabase
      const uploadedImageUrls = await Promise.all(
        fileStates.map(async (fileState) => {
          // Upload file to Supabase Storage using our hook
          console.log("Uploading file:", fileState.file.name)
          const result = await uploadFile(fileState.file).catch((error) => {
            console.error("Error during file upload:", error)
            throw new Error(
              `Upload failed: ${error.message || "Unknown error"}`
            )
          })

          if (!result) {
            throw new Error("File upload failed - no result returned")
          }

          // Update progress in UI
          setFileStates((currentFileStates) => {
            return currentFileStates.map((fs) => {
              if (fs.key === fileState.key) {
                return {
                  ...fs,
                  progress: 100,
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
      toast({
        title: "Success",
        description: `Files uploaded successfully`,
        variant: "default",
      })

      const imageUrl = uploadedImageUrls[0]

      // Create a JSON object to send
      const payload = {
        name: values.name,
        description: values.description,
        position: values.position,
        facebookUrl: values.facebookUrl,
        linkedInProfile: values.linkedInProfile,
        twitterUrl: values.twitterUrl,
        imageUrl,
      }

      await createTeam(payload, fullPath, pathWithoutAdmin, "/admin")

      onClose()
      toast({
        title: "Success",
        description: "New team member has been created successfully",
      })
    } catch (error) {
      console.error("Error creating team member:", error)

      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Reset upload state
      setIsUploading(false)

      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error has occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="name"
                label="Name"
                control={form.control}
                placeholder="Enter team member name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="facebookUrl"
                label="Facebook URL"
                control={form.control}
                placeholder="Enter Facebook URL"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="linkedInProfile"
                label="LinkedIn Profile"
                control={form.control}
                placeholder="Enter LinkedIn Profile URL"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="twitterUrl"
                label="Twitter URL"
                control={form.control}
                placeholder="Enter Twitter URL"
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="position"
              label="Position"
              control={form.control}
              placeholder="Enter position"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label="Description"
              control={form.control}
              placeholder="Enter team member description"
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
              className="w-full h-9"
              loadingText="Saving..."
            >
              Save
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalNewTeam
