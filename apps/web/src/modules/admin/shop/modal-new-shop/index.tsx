"use client"

import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import config from "@/lib/config"
import { handleSupabaseFileUpload } from "@/lib/utils-supabase"
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
  const [uploadProgress, setUploadProgress] = useState(0)
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
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const file = values.files[0]

      // Show toast notification when starting upload
      toast.info(`Uploading ${file.name}...`, {
        id: "file-upload",
        duration: Infinity,
      })

      // Upload file to Supabase Storage
      // Reset upload progress before starting
      setUploadProgress(0)

      const fileUrl = await handleSupabaseFileUpload(
        file,
        config.env.supabase.bucketName,
        "shops", // Folder path
        (progress) => {
          // Update upload progress state to display in UI
          setUploadProgress(progress)

          // Update toast with progress
          toast.info(`Uploading ${file.name}... ${progress.toFixed(0)}%`, {
            id: "file-upload",
            duration: Infinity,
          })
        }
      )

      // Show success toast when upload completes
      toast.success(`${file.name} uploaded successfully`, {
        id: "file-upload",
      })

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
      toast.error("Failed to upload image or create shop. Please try again.")
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
                    // Show toast when file is selected
                    if (files.length > 0) {
                      toast.info(`Selected file: ${files[0].name}`)
                    }
                  }}
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
