import { BASE_URL } from "./utils"

/** A system-generated broadcast alert shown in the Notifications feed. */
export interface SystemNotificationProps {
  id: string
  event: string
  title: string
  body: string
  link: string | null
  createdAt: string
}

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

async function authorizedFetch<T>(
  endpoint: string,
  token: string | undefined,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const result: ApiEnvelope<T> = await response.json()
  if (!response.ok || !result.success) {
    throw new Error(result.message || `Request to ${endpoint} failed`)
  }
  return result.data
}

export const fetchSystemFeed = async (
  token: string | undefined,
  params: { cursor?: string | null; limit?: number } = {}
): Promise<{
  notifications: SystemNotificationProps[]
  nextCursor: string | null
  hasMore: boolean
}> => {
  const query = new URLSearchParams()
  if (params.cursor) query.set("cursor", params.cursor)
  if (params.limit) query.set("limit", String(params.limit))
  return authorizedFetch(`notifications?${query.toString()}`, token)
}

export const fetchUnseenCount = async (token?: string): Promise<number> => {
  const data = await authorizedFetch<{ count: number }>(
    "notifications/unseen-count",
    token
  )
  return data.count
}

export const markSystemSeen = async (
  token: string | undefined
): Promise<void> => {
  await authorizedFetch("notifications/mark-seen", token, { method: "POST" })
}
