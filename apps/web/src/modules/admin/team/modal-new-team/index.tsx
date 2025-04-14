"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { toast } from "@/hooks/use-toast"
import { handleFileUploads, updateFileProgress } from "@/lib/utils"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import { MultiFileDropzone } from "@/modules/common/multiple-file-upload"
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
    try {
      let imageUrl: string | null = ""
      if (fileStates.length > 0) {
        const uploadedImageUrls = await Promise.all(
          fileStates.map(async (fileState) =>
            handleFileUploads(fileState.file, (progress) =>
              updateFileProgress(fileState.key, progress, setFileStates)
            )
          )
        )
        imageUrl = uploadedImageUrls[0]
      }

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
        description: "New form or document has been created successfully",
      })
      // Handle the result, such as showing success or error messages
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
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
