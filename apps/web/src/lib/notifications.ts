import { UserProps } from "./api"
import { BASE_URL } from "./utils"

export type NotificationTargetType =
  "INDIVIDUALS" | "GROUP" | "DISTRICT" | "COUNCIL"
export type NotificationBatchStatus =
  "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED"

export interface InAppNotificationProps {
  id: string
  batchId: string | null
  senderId: string | null
  recipientId: string
  title: string
  body: string
  link: string | null
  read: boolean
  readAt: string | null
  event: string | null
  createdAt: string
}

export interface NotificationBatchProps {
  id: string
  senderId: string
  targetType: NotificationTargetType
  targetRef: string | null
  individualIds: string[]
  title: string
  body: string
  link: string | null
  scheduledFor: string | null
  status: NotificationBatchStatus
  createdAt: string
  updatedAt: string
  recipientCount?: number
  readCount?: number
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

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  [key: string]: any
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

// RECEIVE-SIDE — role-agnostic, scoped to the authenticated caller.

export const fetchUnreadCount = async (token?: string): Promise<number> => {
  const data = await authorizedFetch<{ count: number }>(
    "notifications/unread-count",
    token
  )
  return data.count
}

export const fetchMyNotifications = async (
  token: string | undefined,
  params: { cursor?: string | null; limit?: number; unreadOnly?: boolean } = {}
): Promise<{
  notifications: InAppNotificationProps[]
  nextCursor: string | null
  hasMore: boolean
}> => {
  const query = new URLSearchParams()
  if (params.cursor) query.set("cursor", params.cursor)
  if (params.limit) query.set("limit", String(params.limit))
  if (params.unreadOnly) query.set("unreadOnly", "true")

  return authorizedFetch(`notifications?${query.toString()}`, token)
}

export const fetchNotificationById = async (
  token: string | undefined,
  id: string
): Promise<InAppNotificationProps> => {
  return authorizedFetch(`notifications/${id}`, token)
}

export const markNotificationRead = async (
  token: string | undefined,
  id: string
): Promise<InAppNotificationProps> => {
  return authorizedFetch(`notifications/${id}/read`, token, { method: "PATCH" })
}

export const markAllNotificationsRead = async (
  token: string | undefined
): Promise<{ updatedCount: number }> => {
  return authorizedFetch("notifications/read-all", token, { method: "PATCH" })
}

// SENDER-SIDE — ADMIN/MANAGER only, enforced by the API.

export const fetchNotificationBatches = async (
  token: string | undefined,
  params: {
    page?: number
    limit?: number
    status?: NotificationBatchStatus
  } = {}
): Promise<{
  batches: NotificationBatchProps[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}> => {
  const query = new URLSearchParams()
  if (params.page) query.set("page", String(params.page))
  if (params.limit) query.set("limit", String(params.limit))
  if (params.status) query.set("status", params.status)

  return authorizedFetch(
    `admin/notifications/batches?${query.toString()}`,
    token
  )
}

export const fetchRecipientGroups = async (
  token: string | undefined
): Promise<RecipientGroupProps[]> => {
  return authorizedFetch("admin/recipient-groups", token)
}
