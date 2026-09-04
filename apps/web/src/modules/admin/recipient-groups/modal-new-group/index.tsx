"use client"

import { Form } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { fetchUsers, UserProps } from "@/lib/api"
import { createRecipientGroup } from "@/modules/admin/actions"
import MultiUserSelect from "@/modules/admin/messaging/multi-user-select"
import Modal from "@/modules/admin/modal"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as zod from "zod"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const formSchema = zod.object({
  name: zod
    .string()
    .min(2, { message: "Group name must be at least 2 characters." }),
})

const ModalNewGroup = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserProps[]>([])
  const [memberIds, setMemberIds] = useState<string[]>([])
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)
  const { data: session } = useSession()
  const token = session?.accessToken

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setUsers(await fetchUsers(token))
      } catch (error) {
        console.error("Failed to load users:", error)
      }
    })()
  }, [token])

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: { name: "" },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)

    const result = await createRecipientGroup(
      { name: values.name, memberIds },
      fullPath,
      pathWithoutAdmin
    )

    onClose()
    if (result.success) {
      toast.success("Recipient group created successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="New Recipient Group">
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Group name"
            control={form.control}
            placeholder="e.g. Lilongwe Cooperative Leads"
          />
          <div>
            <label className="form_input shad-input-label mb-2 block">
              Members
            </label>
            <MultiUserSelect
              users={users}
              selectedIds={memberIds}
              onChange={setMemberIds}
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
    </Modal>
  )
}

export default ModalNewGroup
