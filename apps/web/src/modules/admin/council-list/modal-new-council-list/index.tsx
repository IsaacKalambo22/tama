"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
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
  const [fileStates, setFileStates] = useState<FileState[]>([])

  const formSchema = zod.object({
    demarcation: zod.string().min(2, {
      message: "Demarcation must be at least 2 characters.",
    }),
    councilArea: zod.string().min(2, {
      message: "Council area must be at least 2 characters.",
    }),
    council: zod.string().min(2, {
      message: "Councillor  must be at least 2 characters.",
    }),
    firstAlternateCouncillor: zod.string().min(2, {
      message: "First Alternate Councillor  must be at least 2 characters.",
    }),
    secondAlternateCouncillor: zod.string().min(2, {
      message: "Second Alternate Councillor  must be at least 2 characters.",
    }),
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
    },
  })
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)

    if (fileStates.length === 0) {
      toast.error("Please upload at least one image file.")
      setIsLoading(false) // Stop the loading process
      return
    }

    const uploadedImageUrls = await Promise.all(
      fileStates.map(async (fileState) =>
        handleFileUploads(fileState.file, (progress) =>
          updateFileProgress(fileState.key, progress, setFileStates)
        )
      )
    )

    const payload = {
      demarcation: values.demarcation,
      councilArea: values.councilArea,
      council: values.council,
      firstAlternateCouncillor: values.firstAlternateCouncillor,
      secondAlternateCouncillor: values.secondAlternateCouncillor,
      imageUrl: uploadedImageUrls[0],
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
    setIsLoading(false)
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

export default ModalNewCouncilList
