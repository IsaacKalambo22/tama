"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  fetchNotificationById,
  InAppNotificationProps,
} from "@/lib/notifications"
import { formatDateTime } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Props = {
  id: string
}

const NotificationDetail = ({ id }: Props) => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [notification, setNotification] =
    useState<InAppNotificationProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    ;(async () => {
      setIsLoading(true)
      try {
        // The GET marks the notification read as a side effect — see
        // apps/api/src/controllers/notifications#getNotificationById.
        setNotification(await fetchNotificationById(token, id))
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load notification"
        )
      } finally {
        setIsLoading(false)
      }
    })()
  }, [token, id])

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/notifications"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to notifications
      </Link>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : error || !notification ? (
        <Card className="p-6 text-center text-red-500">
          {error || "Notification not found."}
        </Card>
      ) : (
        <Card className="p-6">
          <h1 className="text-xl font-semibold mb-1">{notification.title}</h1>
          <p className="text-xs text-muted-foreground mb-4">
            {formatDateTime(notification.createdAt)}
          </p>
          <p className="whitespace-pre-wrap">{notification.body}</p>
          {notification.link && (
            <Button asChild className="mt-5">
              <Link href={notification.link}>Open</Link>
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}

export default NotificationDetail
