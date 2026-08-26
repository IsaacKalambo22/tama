"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  fetchMyNotifications,
  fetchUnreadCount,
  InAppNotificationProps,
} from "@/lib/notifications"
import { formatDateTime } from "@/lib/utils"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

// Named per the spec: bell polls unread-count on this interval for
// near-real-time updates without websockets/SSE (deliberate v1 choice — see
// apps/api/src/notifications/scheduler.ts for the equivalent send-side note).
// To swap in real-time later, replace this poll with a websocket/SSE
// subscription that pushes unread-count deltas; the bell's rendering logic
// doesn't need to change.
const UNREAD_COUNT_POLL_INTERVAL_MS = 30_000
const RECENT_NOTIFICATIONS_LIMIT = 5

const NotificationBell = () => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [unreadCount, setUnreadCount] = useState(0)
  const [recent, setRecent] = useState<InAppNotificationProps[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const refreshUnreadCount = useCallback(async () => {
    if (!token) return
    try {
      const count = await fetchUnreadCount(token)
      setUnreadCount(count)
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error)
    }
  }, [token])

  useEffect(() => {
    refreshUnreadCount()
    const interval = setInterval(
      refreshUnreadCount,
      UNREAD_COUNT_POLL_INTERVAL_MS
    )
    return () => clearInterval(interval)
  }, [refreshUnreadCount])

  useEffect(() => {
    if (!isOpen || !token) return
    ;(async () => {
      try {
        const { notifications } = await fetchMyNotifications(token, {
          limit: RECENT_NOTIFICATIONS_LIMIT,
        })
        setRecent(notifications)
      } catch (error) {
        console.error("Failed to fetch recent notifications:", error)
      }
    })()
  }, [isOpen, token])

  const handleItemClick = (notification: InAppNotificationProps) => {
    if (!notification.read) {
      setUnreadCount((count) => Math.max(0, count - 1))
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5 dark:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Link
            href="/admin/notifications"
            className="text-xs font-normal text-muted-foreground hover:underline"
            onClick={() => setIsOpen(false)}
          >
            View all
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recent.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            No notifications yet.
          </p>
        ) : (
          recent.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild>
              <Link
                href={`/admin/notifications/${notification.id}`}
                onClick={() => handleItemClick(notification)}
                className="flex flex-col items-start gap-1 whitespace-normal py-2"
              >
                <div className="flex w-full items-center gap-2">
                  {!notification.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-green-600" />
                  )}
                  <span className="truncate font-medium">
                    {notification.title}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {notification.body}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDateTime(notification.createdAt)}
                </p>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationBell
