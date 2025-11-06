"use client"

import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { toast } from "@/hooks/use-toast"
import { TeamProps } from "@/lib/api"
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
import * as zod from "zod"
import { updateTeam } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  team: TeamProps
}

const ModalEditTeam = ({ isOpen, onClose, team }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

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
    name: zod.string().optional(),
    position: zod.string().optional(),
    description: zod.string().optional(),
    facebookUrl: zod.string().optional(),
    linkedInProfile: zod.string().optional(),
    twitterUrl: zod.string().optional(),
    files: zod.custom<File[]>(),
  })

  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name ?? "",
      position: team.position ?? "",
      description: team.description ?? "",
      facebookUrl: team.facebookUrl ?? "",
      linkedInProfile: team.linkedInProfile ?? "",
      twitterUrl: team.twitterUrl ?? "",
      files: [],
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let loadingToast: { id: string; dismiss: () => void } | undefined

    try {
      let imageUrl = team.imageUrl || ""

      // Check if a new file is being uploaded
      if (values.files.length > 0) {
        // Set uploading state to true to show progress bar
        setIsUploading(true)

        // Show toast notification when starting upload
        const file = values.files[0]
        loadingToast = toast({
          title: "Uploading",
          description: `Uploading ${file.name}...`,
          variant: "default",
        })

        try {
          // If there's an existing image, delete it first from Supabase
          if (team.imageUrl && team.imageUrl.trim() !== "") {
            console.log("Deleting existing image:", team.imageUrl)
            await deleteFileFromSupabase(team.imageUrl)
          }

          // Upload the new file
          console.log("Uploading new file:", file.name)
          const uploadResult = await uploadFile(file)

          if (!uploadResult || !uploadResult.url) {
            throw new Error("Failed to upload file - no URL returned")
          }

          imageUrl = uploadResult.url
          console.log("New image URL:", imageUrl)

          // Set uploading state to false after upload completes
          setIsUploading(false)

          // Dismiss the loading toast if it exists
          if (loadingToast) {
            loadingToast.dismiss()
          }

          // Show success toast when upload completes
          toast({
            title: "Success",
            description: `File uploaded successfully`,
            variant: "default",
          })
        } catch (uploadError) {
          console.error("Error during file upload:", uploadError)

          // Dismiss the loading toast if it exists
          if (loadingToast) {
            loadingToast.dismiss()
          }

          // Reset upload state
          setIsUploading(false)

          throw new Error(
            `File upload failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`
          )
        }
      }

      const payload = {
        name: values.name ?? "",
        position: values.position ?? "",
        description: values.description ?? "",
        facebookUrl: values.facebookUrl ?? "",
        linkedInProfile: values.linkedInProfile ?? "",
        twitterUrl: values.twitterUrl ?? "",
        imageUrl,
      }

      console.log("Sending update payload:", payload)
      const result = await updateTeam(
        payload,
        team.id,
        fullPath,
        pathWithoutAdmin
      )

      if (!result.success) {
        throw new Error(result.error || "Failed to update team member")
      }

      onClose()
      toast({
        title: "Success",
        description: `${team.name} has been updated successfully`,
      })
    } catch (error) {
      console.error("Error updating team member:", error)

      // Dismiss the loading toast if it exists
      if (loadingToast) {
        loadingToast.dismiss()
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
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${team.name}`}>
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

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="files"
            label="Team Member Image"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />

          <SubmitButton
            disabled={isLoading || !form.formState.isValid}
            isLoading={isLoading}
            className="w-full h-9"
            loadingText="Updating..."
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default ModalEditTeam
