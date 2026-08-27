"use client"

import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import useCustomPath from "@/hooks/use-custom-path"
import {
  CouncilListProps,
  fetchCouncilList,
  fetchUsers,
  UserProps,
} from "@/lib/api"
import { fetchRecipientGroups, RecipientGroupProps } from "@/lib/notifications"
import { createNotificationBatch } from "@/modules/admin/actions"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as zod from "zod"
import MultiUserSelect from "../multi-user-select"

const TARGET_TYPE_LABELS: Record<string, string> = {
  INDIVIDUALS: "Individuals",
  GROUP: "Saved group",
  DISTRICT: "District",
  COUNCIL: "Council",
}

const formSchema = zod
  .object({
    targetType: zod.enum(["INDIVIDUALS", "GROUP", "DISTRICT", "COUNCIL"]),
    targetRef: zod.string().optional(),
    individualIds: zod.array(zod.string()).default([]),
    title: zod
      .string()
      .min(2, { message: "Title must be at least 2 characters." }),
    body: zod
      .string()
      .min(2, { message: "Message must be at least 2 characters." }),
    link: zod.string().optional(),
    isScheduled: zod.boolean().default(false),
    scheduledFor: zod.date().nullable().optional(),
  })
  .refine(
    (data) =>
      data.targetType !== "INDIVIDUALS" || data.individualIds.length > 0,
    { message: "Select at least one recipient.", path: ["individualIds"] }
  )
  .refine((data) => data.targetType === "INDIVIDUALS" || !!data.targetRef, {
    message: "Select a target.",
    path: ["targetRef"],
  })
  .refine((data) => !data.isScheduled || !!data.scheduledFor, {
    message: "Choose a date and time to schedule for.",
    path: ["scheduledFor"],
  })

const NotificationComposer = () => {
  const { data: session } = useSession()
  const token = session?.accessToken
  const router = useRouter()
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserProps[]>([])
  const [councilLists, setCouncilLists] = useState<CouncilListProps[]>([])
  const [groups, setGroups] = useState<RecipientGroupProps[]>([])

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        const [userList, councilList] = await Promise.all([
          fetchUsers(token),
          fetchCouncilList(),
        ])
        setUsers(userList)
        setCouncilLists(councilList)
      } catch (error) {
        console.error("Failed to load targeting data:", error)
      }
    })()
  }, [token])

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setGroups(await fetchRecipientGroups(token))
      } catch (error) {
        console.error("Failed to load recipient groups:", error)
      }
    })()
  }, [token])

  const districtOptions = Array.from(
    new Set(users.map((user) => user.district).filter((d): d is string => !!d))
  ).sort()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      targetType: "INDIVIDUALS",
      targetRef: "",
      individualIds: [],
      title: "",
      body: "",
      link: "",
      isScheduled: false,
      scheduledFor: null,
    },
  })

  const targetType = form.watch("targetType")
  const isScheduled = form.watch("isScheduled")

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)

    const payload = {
      targetType: values.targetType,
      targetRef:
        values.targetType === "INDIVIDUALS" ? undefined : values.targetRef,
      individualIds:
        values.targetType === "INDIVIDUALS" ? values.individualIds : undefined,
      title: values.title,
      body: values.body,
      link: values.link || undefined,
      scheduledFor:
        values.isScheduled && values.scheduledFor
          ? values.scheduledFor.toISOString()
          : undefined,
    }

    const result = await createNotificationBatch(
      payload,
      fullPath,
      pathWithoutAdmin
    )

    if (result.success) {
      toast.success(
        values.isScheduled
          ? "Notification scheduled successfully"
          : "Notification sent successfully"
      )
      form.reset()
      router.push("/admin/notifications/batches")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5 w-full max-w-2xl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="targetType"
          label="Send to"
          control={form.control}
          placeholder="Select a target type"
        >
          {Object.entries(TARGET_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </CustomFormField>

        {targetType === "INDIVIDUALS" && (
          <div className="flex-1">
            <label className="form_input shad-input-label mb-2 block">
              Recipients
            </label>
            <MultiUserSelect
              users={users}
              selectedIds={form.watch("individualIds")}
              onChange={(ids) =>
                form.setValue("individualIds", ids, { shouldValidate: true })
              }
            />
            {form.formState.errors.individualIds && (
              <p className="shad-error mt-1">
                {form.formState.errors.individualIds.message as string}
              </p>
            )}
          </div>
        )}

        {targetType === "GROUP" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="targetRef"
            label="Saved group"
            control={form.control}
            placeholder="Select a group"
          >
            {groups.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No saved groups yet.
              </p>
            ) : (
              groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name} ({group.memberCount ?? 0})
                </SelectItem>
              ))
            )}
          </CustomFormField>
        )}

        {targetType === "DISTRICT" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="targetRef"
            label="District"
            control={form.control}
            placeholder="Select a district"
          >
            {districtOptions.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </CustomFormField>
        )}

        {targetType === "COUNCIL" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="targetRef"
            label="Council"
            control={form.control}
            placeholder="Select a council"
          >
            {councilLists.map((council) => (
              <SelectItem key={council.id} value={council.id}>
                {council.council} — {council.councilArea}
              </SelectItem>
            ))}
          </CustomFormField>
        )}

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          name="title"
          label="Title"
          control={form.control}
          placeholder="e.g. Council meeting this Friday"
        />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          name="body"
          label="Message"
          control={form.control}
          placeholder="Write the notification message..."
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          name="link"
          label="Link (optional)"
          control={form.control}
          placeholder="/admin/tobacco-business/events"
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          name="isScheduled"
          label="Schedule for later instead of sending now"
          control={form.control}
        />

        {isScheduled && (
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name="scheduledFor"
            label="Send at"
            control={form.control}
            placeholder="Select date and time"
            showTimeSelect
            dateFormat="MM/dd/yyyy h:mm aa"
          />
        )}

        <SubmitButton
          disabled={isLoading || !form.formState.isValid}
          isLoading={isLoading}
          className="w-full h-10"
          loadingText="Sending..."
        >
          {isScheduled ? "Schedule Notification" : "Send Notification"}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default NotificationComposer
