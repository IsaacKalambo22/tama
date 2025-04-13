"use client"
import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { ShopProps } from "@/lib/api"
import { handleFileUpload } from "@/lib/utils"
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
import { updateShop } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  shop: ShopProps
}

const ModalEditShop = ({ isOpen, onClose, shop }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const formSchema = zod.object({
    name: zod.string().optional(),
    address: zod.string().optional(),
    openHours: zod.string().optional(),
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
    let imageUrl = ""
    let size = undefined

    if (values.files.length > 0) {
      const file = values.files[0]
      imageUrl = await handleFileUpload(file)
      size = Number(file.size)
    }

    const payload = {
      name: values.name ?? "",
      openHours: values.openHours ?? "",
      address: values.address ?? "",
      imageUrl,
      size: size,
    }

    const result = await updateShop(
      payload,
      shop.id,
      fullPath,
      `/tobacco-business/shops`
    )

    onClose()
    if (result.success) {
      toast.success("Shop updated successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${shop.name}`}>
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
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
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

export default ModalEditShop
