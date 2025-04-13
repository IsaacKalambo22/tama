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
import { getFileType, handleFileUpload } from "@/lib/utils"
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
import { createForm } from "../../actions"
type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const ModalNewForm = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const MAX_FILE_SIZE_MB = 50 // Maximum file size in MB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024 // Convert to bytes
  const VALID_FILE_TYPE = "application/pdf" // Only allow PDF files

  const formSchema = zod.object({
    filename: zod.string().min(2, {
      message: "Filename must be at least 2 characters.",
    }),
    files: zod
      .array(zod.instanceof(File))
      .refine((files) => files.length > 0, {
        message: "At least one file is required.",
      })
      .refine((files) => files.length <= 2, {
        message: "You can upload up to 4 files only.",
      })
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE_BYTES),
        {
          message: `Each file must be less than ${MAX_FILE_SIZE_MB} MB.`,
        }
      )
      .refine((files) => files.every((file) => file.type === VALID_FILE_TYPE), {
        message: "Only PDF files are allowed.",
      }),
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
    const file = values.files[0]
    const fileUrl = await handleFileUpload(file)
    const fileProps = getFileType(file.name)
    console.log({ fileProps })
    // Create a JSON object to send
    const payload = {
      filename: values.filename,
      size: file.size,
      extension: fileProps.extension,
      type: fileProps.type,
      fileUrl: fileUrl, // Add the uploaded file URL
    }

    // Call the createForm function to send data to the server
    const result = await createForm(
      payload,
      fullPath,
      pathWithoutAdmin,
      "/admin"
    )

    onClose()
    if (result.success) {
      toast.success("Form created successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Form or Document</DialogTitle>
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
              placeholder="Enter form name"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="files"
              label="File"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
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
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalNewForm
