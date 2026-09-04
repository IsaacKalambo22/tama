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
  fetchSystemFeed,
  fetchUnseenCount,
  markSystemSeen,
  SystemNotificationProps,
} from "@/lib/system-notifications"
import { formatDateTime } from "@/lib/utils"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

// Separate code path from the Messaging bell — different endpoint, different
// model. Polling only (no websocket/SSE).
const UNSEEN_COUNT_POLL_INTERVAL_MS = 60_000
const RECENT_LIMIT = 5

const SystemNotificationBell = () => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [unseenCount, setUnseenCount] = useState(0)
  const [recent, setRecent] = useState<SystemNotificationProps[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const refreshUnseenCount = useCallback(async () => {
    if (!token) return
    try {
      setUnseenCount(await fetchUnseenCount(token))
    } catch (error) {
      console.error("Failed to fetch unseen notification count:", error)
    }
  }, [token])

  useEffect(() => {
    refreshUnseenCount()
    const interval = setInterval(
      refreshUnseenCount,
      UNSEEN_COUNT_POLL_INTERVAL_MS
    )
    return () => clearInterval(interval)
  }, [refreshUnseenCount])

  useEffect(() => {
    if (!isOpen || !token) return
    ;(async () => {
      try {
        const { notifications } = await fetchSystemFeed(token, {
          limit: RECENT_LIMIT,
        })
        setRecent(notifications)
        await markSystemSeen(token)
        setUnseenCount(0)
      } catch (error) {
        console.error("Failed to fetch system notifications:", error)
      }
    })()
  }, [isOpen, token])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5 dark:text-white" />
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {unseenCount > 99 ? "99+" : unseenCount}
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
            Nothing announced yet.
          </p>
        ) : (
          recent.map((item) => {
            const content = (
              <div className="flex flex-col items-start gap-1 whitespace-normal py-2">
                <span className="truncate font-medium">{item.title}</span>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {item.body}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </p>
              </div>
            )
            return (
              <DropdownMenuItem key={item.id} asChild={!!item.link}>
                {item.link ? (
                  <Link href={item.link} onClick={() => setIsOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SystemNotificationBell
