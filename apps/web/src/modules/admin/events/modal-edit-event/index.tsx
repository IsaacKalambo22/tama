"use client"

import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { EventProps } from "@/lib/api"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as zod from "zod"
import { updateEvent } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  event?: EventProps // Preloaded event data for editing
}

const ModalEditEvent = ({ isOpen, onClose, event }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)

  // Define the schema for event data
  const formSchema = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    date: zod.date().optional(),
    time: zod.string().optional(),
    endDate: zod.date().optional(),
    location: zod.string().optional(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      time: "",
      endDate: undefined,
      location: "",
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    if (!event?.id) return

    setIsLoading(true)
    const payload = {
      title: values.title,
      description: values.description,
      date: values.date,
      time: values.time || null,
      endDate: values.endDate || null,
      location: values.location,
    }

    // Update event
    const result = await updateEvent(
      payload,
      event.id,
      fullPath,
      `/tobacco-business/event-calendar`
    )
    onClose()
    if (result.success) {
      toast.success("Event updated successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Event">
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="title"
            label="Event Title"
            control={form.control}
            placeholder="Enter event title"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="description"
            label="Description"
            control={form.control}
            placeholder="Enter event description"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name="date"
            label="Date"
            control={form.control}
            placeholder="YYYY-MM-DD"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="time"
            label="Time (optional)"
            control={form.control}
            placeholder="HH:mm"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name="endDate"
            label="End Date (optional)"
            control={form.control}
            placeholder="YYYY-MM-DD"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="location"
            label="Location (optional)"
            control={form.control}
            placeholder="Enter location"
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

export default ModalEditEvent
