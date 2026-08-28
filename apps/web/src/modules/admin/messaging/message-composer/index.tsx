"use client"

import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import useCustomPath from "@/hooks/use-custom-path"
import {
  CouncilProps,
  DistrictProps,
  fetchAllDistricts,
  fetchCouncils,
  fetchUsers,
  UserProps,
} from "@/lib/api"
import {
  ComposeMessagePayload,
  fetchRecipientGroups,
  RecipientGroupProps,
} from "@/lib/messaging"
import { createMessageBatch } from "@/modules/admin/actions"
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

const SMS_SINGLE_LIMIT = 160
const SMS_CONCAT_PART = 153

/**
 * Builds a printable cost summary from the send result. Each channel that
 * InfiSend charged for is shown as "Email MWK X" / "SMS MWK Y"; returns null
 * when no cost is known yet (e.g. scheduled sends that haven't run).
 */
function formatSentCost(data: unknown): string | null {
  const channels = (
    data as { channels?: { channel: string; status: string; cost?: string }[] }
  )?.channels
  if (!channels) return null

  const parts = channels
    .filter((c) => c.status === "sent" && c.cost)
    .map((c) => {
      const label =
        c.channel === "EMAIL"
          ? "Email"
          : c.channel === "SMS"
            ? "SMS"
            : c.channel
      return `${label} ${c.cost}`
    })

  return parts.length > 0 ? parts.join(" · ") : null
}

const formSchema = zod
  .object({
    targetType: zod.enum(["INDIVIDUALS", "GROUP", "DISTRICT", "COUNCIL"]),
    targetRef: zod.string().optional(),
    individualIds: zod.array(zod.string()).default([]),

    channelEmail: zod.boolean().default(true),
    channelInApp: zod.boolean().default(true),
    channelSms: zod.boolean().default(false),

    emailSubject: zod.string().optional(),
    emailBody: zod.string().optional(),
    emailFromName: zod.string().max(80).optional(),

    inAppTitle: zod.string().optional(),
    inAppBody: zod.string().optional(),
    inAppLink: zod.string().optional(),

    smsMessage: zod.string().optional(),

    isScheduled: zod.boolean().default(false),
    scheduledFor: zod.date().nullable().optional(),
  })
  .refine((d) => d.channelEmail || d.channelInApp || d.channelSms, {
    message: "Select at least one channel.",
    path: ["channelInApp"],
  })
  .refine((d) => d.targetType !== "INDIVIDUALS" || d.individualIds.length > 0, {
    message: "Select at least one recipient.",
    path: ["individualIds"],
  })
  .refine((d) => d.targetType === "INDIVIDUALS" || !!d.targetRef, {
    message: "Select a target.",
    path: ["targetRef"],
  })
  .refine((d) => !d.channelInApp || (d.inAppTitle ?? "").trim().length >= 2, {
    message: "In-app title must be at least 2 characters.",
    path: ["inAppTitle"],
  })
  .refine((d) => !d.channelInApp || (d.inAppBody ?? "").trim().length >= 2, {
    message: "In-app message must be at least 2 characters.",
    path: ["inAppBody"],
  })
  .refine((d) => !d.channelEmail || (d.emailSubject ?? "").trim().length >= 2, {
    message: "Email subject must be at least 2 characters.",
    path: ["emailSubject"],
  })
  .refine((d) => !d.channelEmail || (d.emailBody ?? "").trim().length >= 2, {
    message: "Email body must be at least 2 characters.",
    path: ["emailBody"],
  })
  .refine(
    (d) =>
      !d.channelSms ||
      ((d.smsMessage ?? "").length >= 1 &&
        (d.smsMessage ?? "").length <= 10000),
    {
      message: "SMS message must be between 1 and 10,000 characters.",
      path: ["smsMessage"],
    }
  )
  .refine((d) => !d.isScheduled || !!d.scheduledFor, {
    message: "Choose a date and time to schedule for.",
    path: ["scheduledFor"],
  })

type FormValues = zod.infer<typeof formSchema>

const MessageComposer = () => {
  const { data: session } = useSession()
  const token = session?.accessToken
  const router = useRouter()
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserProps[]>([])
  const [districts, setDistricts] = useState<DistrictProps[]>([])
  const [councils, setCouncils] = useState<CouncilProps[]>([])
  const [groups, setGroups] = useState<RecipientGroupProps[]>([])

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setUsers(await fetchUsers(token))
      } catch (error) {
        console.error("Failed to load recipients:", error)
      }
    })()
    ;(async () => {
      try {
        setDistricts(await fetchAllDistricts(token))
      } catch (error) {
        console.error("Failed to load districts:", error)
      }
    })()
    ;(async () => {
      try {
        setCouncils(await fetchCouncils(token))
      } catch (error) {
        console.error("Failed to load councils:", error)
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      targetType: "INDIVIDUALS",
      targetRef: "",
      individualIds: [],
      channelEmail: true,
      channelInApp: true,
      channelSms: false,
      emailSubject: "",
      emailBody: "",
      emailFromName: "",
      inAppTitle: "",
      inAppBody: "",
      inAppLink: "",
      smsMessage: "",
      isScheduled: false,
      scheduledFor: null,
    },
  })

  const targetType = form.watch("targetType")
  const individualIds = form.watch("individualIds")
  const isScheduled = form.watch("isScheduled")
  const channelEmail = form.watch("channelEmail")
  const channelInApp = form.watch("channelInApp")
  const channelSms = form.watch("channelSms")
  const smsMessage = form.watch("smsMessage") ?? ""

  const smsParts =
    smsMessage.length === 0
      ? 0
      : smsMessage.length <= SMS_SINGLE_LIMIT
        ? 1
        : Math.ceil(smsMessage.length / SMS_CONCAT_PART)

  const buildPayload = (values: FormValues): ComposeMessagePayload => {
    const channels: ComposeMessagePayload["channels"] = []
    if (values.channelInApp) channels.push("IN_APP")
    if (values.channelEmail) channels.push("EMAIL")
    if (values.channelSms) channels.push("SMS")

    return {
      targetType: values.targetType,
      targetRef:
        values.targetType === "INDIVIDUALS"
          ? undefined
          : values.targetRef || undefined,
      individualIds:
        values.targetType === "INDIVIDUALS" ? values.individualIds : undefined,
      channels,
      content: {
        inApp: values.channelInApp
          ? {
              title: (values.inAppTitle ?? "").trim(),
              body: (values.inAppBody ?? "").trim(),
              link: values.inAppLink || undefined,
            }
          : undefined,
        email: values.channelEmail
          ? {
              subject: (values.emailSubject ?? "").trim(),
              text: (values.emailBody ?? "").trim(),
              fromName: (values.emailFromName ?? "").trim() || undefined,
            }
          : undefined,
        sms: values.channelSms
          ? { message: values.smsMessage ?? "" }
          : undefined,
      },
      scheduledFor:
        values.isScheduled && values.scheduledFor
          ? values.scheduledFor.toISOString()
          : undefined,
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    const result = await createMessageBatch(
      buildPayload(values),
      fullPath,
      pathWithoutAdmin
    )

    if (result.success) {
      const costSummary = formatSentCost(result.data)
      toast.success(
        values.isScheduled
          ? "Message scheduled successfully"
          : costSummary
            ? `Message sent · ${costSummary}`
            : "Message sent successfully"
      )
      form.reset()
      router.push("/admin/messages/batches")
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
              selectedIds={individualIds}
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
            {districts.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No districts found.
              </p>
            ) : (
              districts.map((district) => (
                <SelectItem key={district.id} value={district.name}>
                  {district.name}
                </SelectItem>
              ))
            )}
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
            {councils.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No councils found.
              </p>
            ) : (
              councils.map((council) => (
                <SelectItem key={council.id} value={council.name}>
                  {council.name}
                </SelectItem>
              ))
            )}
          </CustomFormField>
        )}

        <Card className="flex flex-col gap-2 p-4">
          <p className="text-sm font-medium">Channels</p>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            name="channelEmail"
            label="Email"
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            name="channelInApp"
            label="In-App (Inbox)"
            control={form.control}
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            name="channelSms"
            label="SMS"
            control={form.control}
          />
          {form.formState.errors.channelInApp && (
            <p className="shad-error">
              {form.formState.errors.channelInApp.message as string}
            </p>
          )}
        </Card>

        {channelInApp && (
          <Card className="flex flex-col gap-4 p-4">
            <p className="text-sm font-medium">In-app message</p>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="inAppTitle"
              label="Title"
              control={form.control}
              placeholder="e.g. Council meeting this Friday"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="inAppBody"
              label="Message"
              control={form.control}
              placeholder="Write the in-app message..."
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="inAppLink"
              label="Link (optional)"
              control={form.control}
              placeholder="/admin/tobacco-business/events"
            />
          </Card>
        )}

        {channelEmail && (
          <Card className="flex flex-col gap-4 p-4">
            <p className="text-sm font-medium">Email</p>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="emailSubject"
              label="Subject"
              control={form.control}
              placeholder="Email subject line"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="emailBody"
              label="Body"
              control={form.control}
              placeholder="Write the email..."
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="emailFromName"
              label="From name (optional)"
              control={form.control}
              placeholder='Defaults to "TaMalawi"'
            />
          </Card>
        )}

        {channelSms && (
          <Card className="flex flex-col gap-4 p-4">
            <p className="text-sm font-medium">SMS</p>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="smsMessage"
              label="Message"
              control={form.control}
              placeholder="Write the SMS text..."
            />
            <p className="text-xs text-muted-foreground">
              {smsMessage.length} characters ·{" "}
              {smsParts === 0
                ? "0 parts"
                : `${smsParts} SMS part${smsParts > 1 ? "s" : ""} per recipient`}
              . Longer messages cost more — each part is billed separately.
            </p>
          </Card>
        )}

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
          {isScheduled ? "Schedule message" : "Send message"}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default MessageComposer
