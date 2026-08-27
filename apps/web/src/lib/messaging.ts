import { UserProps } from "./api"
import { BASE_URL } from "./utils"

export type MessageTargetType = "INDIVIDUALS" | "GROUP" | "DISTRICT" | "COUNCIL"
export type MessageChannel = "IN_APP" | "EMAIL" | "SMS"
export type MessageBatchStatus = "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED"

/** A received in-app message shown in the Inbox. */
export interface InAppMessageProps {
  id: string
  batchId: string | null
  senderId: string | null
  recipientId: string
  title: string
  body: string
  link: string | null
  read: boolean
  readAt: string | null
  createdAt: string
}

export interface MessageBatchProps {
  id: string
  senderId: string
  targetType: MessageTargetType
  targetRef: string | null
  individualIds: string[]
  channels: MessageChannel[]
  inAppTitle: string | null
  inAppBody: string | null
  inAppLink: string | null
  emailSubject: string | null
  emailText: string | null
  emailTemplateId: string | null
  smsMessage: string | null
  scheduledFor: string | null
  status: MessageBatchStatus
  createdAt: string
  updatedAt: string
  recipientCount?: number
  readCount?: number
  emailCount?: number
  smsCount?: number
}

export interface RecipientGroupProps {
  id: string
  name: string
  createdBy: string
  createdAt: string
  updatedAt: string
  memberCount?: number
  members?: { id: string; userId: string; user: UserProps }[]
}

export interface MessageContent {
  inApp?: { title: string; body: string; link?: string }
  email?: {
    subject?: string
    text?: string
    html?: string
    templateId?: string
    variables?: Record<string, string>
  }
  sms?: {
    message?: string
    templateId?: string
    variables?: Record<string, string>
    senderId?: string
  }
}

export interface ComposeMessagePayload {
  targetType: MessageTargetType
  targetRef?: string
  individualIds?: string[]
  channels: MessageChannel[]
  content: MessageContent
  scheduledFor?: string
}

export interface CostPreview {
  reach: number
  emailReach?: number
  smsReach?: number
  invalidPhones?: string[]
  email?: {
    available: boolean
    reason?: string
    estimatedCost?: string
    invalidRecipients?: string[]
  }
  sms?: {
    available: boolean
    reason?: string
    estimatedCost?: string
    invalidRecipients?: string[]
  }
}

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  [key: string]: unknown
}

async function authorizedFetch<T>(
  endpoint: string,
  token: string | undefined,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  })
  const result: ApiEnvelope<T> = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Request to ${endpoint} failed`)
  }

  return result.data
}

// ── RECEIVE-SIDE (Inbox) — identity-scoped, any authenticated dashboard ──

export const fetchUnreadCount = async (token?: string): Promise<number> => {
  const data = await authorizedFetch<{ count: number }>(
    "inbox/unread-count",
    token
  )
  return data.count
}

export const fetchMyMessages = async (
  token: string | undefined,
  params: { cursor?: string | null; limit?: number; unreadOnly?: boolean } = {}
): Promise<{
  messages: InAppMessageProps[]
  nextCursor: string | null
  hasMore: boolean
}> => {
  const query = new URLSearchParams()
  if (params.cursor) query.set("cursor", params.cursor)
  if (params.limit) query.set("limit", String(params.limit))
  if (params.unreadOnly) query.set("unreadOnly", "true")

  return authorizedFetch(`inbox?${query.toString()}`, token)
}

export const fetchMessageById = async (
  token: string | undefined,
  id: string
): Promise<InAppMessageProps> => {
  return authorizedFetch(`inbox/${id}`, token)
}

export const markMessageRead = async (
  token: string | undefined,
  id: string
): Promise<InAppMessageProps> => {
  return authorizedFetch(`inbox/${id}/read`, token, { method: "PATCH" })
}

export const markAllMessagesRead = async (
  token: string | undefined
): Promise<{ updatedCount: number }> => {
  return authorizedFetch("inbox/read-all", token, { method: "PATCH" })
}

// ── SENDER-SIDE — SUPER_ADMIN / COUNCIL_ADMIN / DISTRICT_ADMIN only ──

export const fetchMessageBatches = async (
  token: string | undefined,
  params: { page?: number; limit?: number; status?: MessageBatchStatus } = {}
): Promise<{
  batches: MessageBatchProps[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}> => {
  const query = new URLSearchParams()
  if (params.page) query.set("page", String(params.page))
  if (params.limit) query.set("limit", String(params.limit))
  if (params.status) query.set("status", params.status)

  return authorizedFetch(`admin/messages/batches?${query.toString()}`, token)
}

export const previewMessageCost = async (
  token: string | undefined,
  payload: Pick<
    ComposeMessagePayload,
    "targetType" | "targetRef" | "individualIds" | "channels"
  >
): Promise<CostPreview> => {
  return authorizedFetch("admin/messages/preview-cost", token, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export const fetchRecipientGroups = async (
  token: string | undefined
): Promise<RecipientGroupProps[]> => {
  return authorizedFetch("admin/recipient-groups", token)
}
