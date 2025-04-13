"use client"

import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import useCustomPath from "@/hooks/use-custom-path"
import { VacancyProps, VacancyStatus } from "@/lib/api" // Update the import according to your API
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
import { updateVacancy } from "../../actions" // Ensure this function is properly defined
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  vacancy: VacancyProps // Preloaded vacancy data for editing
}

const ModalEditVacancy = ({ isOpen, onClose, vacancy }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  // Define the schema for vacancy data
  const formSchema = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    company: zod.string().optional(),
    location: zod.string().optional(),
    duties: zod.string().optional(),
    qualifications: zod.string().optional(),
    howToApply: zod.string().optional(),
    salary: zod.string().optional(),
    applicationDeadline: zod.date().optional(),
    status: zod.enum([VacancyStatus.OPEN, VacancyStatus.CLOSED]),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary: "",
      company: "",
      duties: "",
      qualifications: "",
      howToApply: "",
      applicationDeadline: undefined,
      status: vacancy?.status || VacancyStatus.OPEN,
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)

    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      company: values.company,
      duties: values.duties,
      qualifications: values.qualifications,
      howToApply: values.howToApply,
      salary: values.salary || null,
      applicationDeadline: values.applicationDeadline,
      status: values.status,
    }

    const result = await updateVacancy(
      payload,
      vacancy.id,
      fullPath,
      "/resources/vacancies"
    )
    onClose()
    if (result.success) {
      toast.success("Vacancy updated successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Edit Vacancy ${vacancy?.title}`}
    >
      <div className="overflow-auto max-h-[80vh] p-4">
        <Form {...form}>
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="title"
              label="Vacancy Title"
              control={form.control}
              placeholder="Enter vacancy title"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="description"
              label="Description"
              control={form.control}
              placeholder="Enter vacancy description"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="location"
              label="Location"
              control={form.control}
              placeholder="Enter location"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="salary"
              label="Salary (optional)"
              control={form.control}
              placeholder="Enter salary range"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="company"
              label="Company"
              control={form.control}
              placeholder="Enter company name"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="duties"
              label="Duties"
              control={form.control}
              placeholder="Enter duties"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="qualifications"
              label="Qualifications (optional)"
              control={form.control}
              placeholder="Enter qualifications range"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="howToApply"
              label="How to Apply"
              control={form.control}
              placeholder="Enter application instructions"
            />
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              name="applicationDeadline"
              label="Application Deadline"
              control={form.control}
              placeholder="YYYY-MM-DD"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="status"
              label="Status"
              control={form.control}
            >
              {Object.entries(VacancyStatus).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value}
                </SelectItem>
              ))}
            </CustomFormField>

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
      </div>
    </Modal>
  )
}

export default ModalEditVacancy
