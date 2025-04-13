"use client"

import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { toast } from "@/hooks/use-toast"
import { StatProps } from "@/lib/api"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { updateStat } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  stat: StatProps
}

// New schema
const formSchema = zod.object({
  registeredCustomers: zod
    .number({ required_error: "Required" })
    .min(0, "Must be at least 0"),
  shops: zod
    .number({ required_error: "Required" })
    .min(0, "Must be at least 0"),
  councilors: zod
    .number({ required_error: "Required" })
    .min(0, "Must be at least 0"),
  cooperatives: zod
    .number({ required_error: "Required" })
    .min(0, "Must be at least 0"),
})

const ModalEditStat = ({ isOpen, onClose, stat }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registeredCustomers: stat.registeredCustomers ?? 0,
      shops: stat.shops ?? 0,
      councilors: stat.councilors ?? 0,
      cooperatives: stat.cooperatives ?? 0,
    },
  })

  useEffect(() => {
    if (stat) {
      form.reset({
        registeredCustomers: stat.registeredCustomers ?? 0,
        shops: stat.shops ?? 0,
        councilors: stat.councilors ?? 0,
        cooperatives: stat.cooperatives ?? 0,
      })
    }
  }, [stat, form])

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const result = await updateStat(
        values,
        stat.id,
        fullPath,
        `/status${pathWithoutAdmin}`
      )

      toast({
        title: "Success",
        description: `Stat has been updated successfully`,
      })

      onClose()
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the stat.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit Stat${stat.id}`}>
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            name="registeredCustomers"
            label="Registered Customers"
            control={form.control}
            placeholder="Enter number of registered customers"
          />
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            name="shops"
            label="Shops"
            control={form.control}
            placeholder="Enter number of shops"
          />
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            name="councilors"
            label="Councilors"
            control={form.control}
            placeholder="Enter number of councilors"
          />
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            name="cooperatives"
            label="Cooperatives"
            control={form.control}
            placeholder="Enter number of cooperatives"
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

export default ModalEditStat
