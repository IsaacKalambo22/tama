import { BASE_URL } from "./utils"

export type SupportStatus = "SENT" | "RESOLVED"

export interface SupportThreadSummary {
  id: string
  subject: string
  status: SupportStatus
  createdAt: string
  updatedAt: string
  farmer: {
    id: string
    name: string
    district: string | null
    council: string | null
  }
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export interface SupportPost {
  authorId: string | null
  authorName: string
  authorRole: string | null
  body: string
  createdAt: string
  mine: boolean
}

export interface SupportThread {
  id: string
  subject: string
  status: SupportStatus
  createdAt: string
  farmer: {
    id: string
    name: string
    district: string | null
    council: string | null
  }
  posts: SupportPost[]
}

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

async function request<T>(
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

export const fetchSupportThreads = (
  token: string | undefined
): Promise<SupportThreadSummary[]> => request("support", token)

export const fetchSupportThread = (
  token: string | undefined,
  id: string
): Promise<SupportThread> => request(`support/${id}`, token)

export const createSupportRequest = (
  token: string | undefined,
  payload: { subject: string; message: string }
): Promise<{ id: string }> =>
  request("support", token, {
    method: "POST",
    body: JSON.stringify(payload),
  })

export const replySupportThread = (
  token: string | undefined,
  id: string,
  message: string
): Promise<{ id: string }> =>
  request(`support/${id}/reply`, token, {
    method: "POST",
    body: JSON.stringify({ message }),
  })

export const setSupportThreadStatus = (
  token: string | undefined,
  id: string,
  status: SupportStatus
): Promise<{ id: string; status: SupportStatus }> =>
  request(`support/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
