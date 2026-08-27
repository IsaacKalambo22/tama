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
  fetchMyMessages,
  fetchUnreadCount,
  InAppMessageProps,
} from "@/lib/messaging"
import { formatDateTime } from "@/lib/utils"
import { Mail } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

// Polling is the deliberate v1 choice — no websocket/SSE infrastructure exists.
const UNREAD_COUNT_POLL_INTERVAL_MS = 30_000
const RECENT_LIMIT = 5

const MessageBell = () => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [unreadCount, setUnreadCount] = useState(0)
  const [recent, setRecent] = useState<InAppMessageProps[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const refreshUnreadCount = useCallback(async () => {
    if (!token) return
    try {
      setUnreadCount(await fetchUnreadCount(token))
    } catch (error) {
      console.error("Failed to fetch unread message count:", error)
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
        const { messages } = await fetchMyMessages(token, {
          limit: RECENT_LIMIT,
        })
        setRecent(messages)
      } catch (error) {
        console.error("Failed to fetch recent messages:", error)
      }
    })()
  }, [isOpen, token])

  const handleItemClick = (message: InAppMessageProps) => {
    if (!message.read) setUnreadCount((count) => Math.max(0, count - 1))
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Mail className="h-5 w-5 dark:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Inbox</span>
          <Link
            href="/admin/messages/inbox"
            className="text-xs font-normal text-muted-foreground hover:underline"
            onClick={() => setIsOpen(false)}
          >
            View all
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recent.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        ) : (
          recent.map((message) => (
            <DropdownMenuItem key={message.id} asChild>
              <Link
                href={`/admin/messages/inbox/${message.id}`}
                onClick={() => handleItemClick(message)}
                className="flex flex-col items-start gap-1 whitespace-normal py-2"
              >
                <div className="flex w-full items-center gap-2">
                  {!message.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-green-600" />
                  )}
                  <span className="truncate font-medium">{message.title}</span>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {message.body}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDateTime(message.createdAt)}
                </p>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageBell
