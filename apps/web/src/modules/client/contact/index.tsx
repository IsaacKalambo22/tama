"use client"

import { Form } from "@/components/ui/form"
import { sendContactMessage } from "@/modules/admin/actions"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import HeaderText from "@/modules/common/header-text"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

// Define the Zod schema
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number format"),
  message: z.string().min(1, "Message is required"),
})

// Extract the TypeScript type for the form data
type ContactFormData = z.infer<typeof contactSchema>

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    console.log({ data })
    const name = `${data.firstName} ${data.lastName}`

    setIsLoading(true)
    const payload = {
      name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.message,
    }
    const result = await sendContactMessage(payload)

    if (result.success) {
      toast.success("Message sent successfully")
      form.reset()
    } else {
      toast.error(result.error ?? "An error occurred while sending message.")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex w-full flex-col gap-10 mb-16 max-w-3xl mx-auto items-center">
      <HeaderText
        title="Let’s have a chat"
        subtitle="Questions about our products or services or just want to say hello? We are here to help."
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6 w-full"
        >
          {/* First Name and Last Name in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="firstName"
              label="First Name"
              control={form.control}
              placeholder="Enter your first name"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="lastName"
              label="Last Name"
              control={form.control}
              placeholder="Enter your last name"
            />
          </div>

          {/* Email and Phone Number in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              control={form.control}
              placeholder="Enter your email"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="phoneNumber"
              label="Phone Number"
              control={form.control}
              placeholder="Enter your phone number"
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="message"
            label="Message"
            control={form.control}
            placeholder="Enter your message"
          />
          <SubmitButton
            disabled={isLoading || !form.formState.isValid}
            isLoading={isLoading}
            className="w-full h-9"
            loadingText="Sending message..."
          >
            Send Message
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}

export default Contact
