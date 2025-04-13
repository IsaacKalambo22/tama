"use client"
import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { removeFromS3 } from "@/lib/aws"
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
import { updateHomeCarousel } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  homeCarousel: HomeCarousel
}

const ModalEditHomeCarousel = ({ isOpen, onClose, homeCarousel }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const [fileStates, setFileStates] = useState<FileState[]>([])

  const formSchema = zod.object({
    title: zod
      .string()
      .min(2, {
        message: "Title must be at least 2 characters.",
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

  // Set initial form default values from the `homeCarousel` prop
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: homeCarousel.title || "",
      description: homeCarousel.description || "",
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)

    let coverUrl: string | null = ""

    if (fileStates.length > 0) {
      const imageUrls = await Promise.all(
        fileStates.map(async (fileState) =>
          handleFileUploads(fileState.file, (progress) =>
            updateFileProgress(fileState.key, progress, setFileStates)
          )
        )
      )
      coverUrl = imageUrls[0]
    }
    if (coverUrl && homeCarousel.coverUrl) {
      await removeFromS3(homeCarousel.coverUrl)
    }

    // Create a JSON object to send
    const payload = {
      title: values.title,
      description: values.description,
      coverUrl,
    }

    const result = await updateHomeCarousel(
      payload,
      homeCarousel.id,
      fullPath,
      "/admin"
    )

    if (result.success) {
      toast.success("HomeCarousel updated successfully")
      onClose()
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit HomeCarousel`}>
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

export default ModalEditHomeCarousel
