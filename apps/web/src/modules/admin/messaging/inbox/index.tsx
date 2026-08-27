"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  fetchMyMessages,
  InAppMessageProps,
  markAllMessagesRead,
} from "@/lib/messaging"
import { cn, formatDateTime } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

const PAGE_SIZE = 20

const MessageInbox = () => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [messages, setMessages] = useState<InAppMessageProps[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  const loadFirstPage = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const result = await fetchMyMessages(token, { limit: PAGE_SIZE })
      setMessages(result.messages)
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("Failed to fetch inbox:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage])

  const loadMore = async () => {
    if (!token || !cursor) return
    setIsLoadingMore(true)
    try {
      const result = await fetchMyMessages(token, { limit: PAGE_SIZE, cursor })
      setMessages((prev) => [...prev, ...result.messages])
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("Failed to fetch more messages:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleMarkAllRead = async () => {
    if (!token) return
    setIsMarkingAll(true)
    try {
      await markAllMessagesRead(token)
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })))
      toast.success("All messages marked as read")
    } catch (error) {
      console.error("Failed to mark all messages as read:", error)
      toast.error("Failed to mark all as read")
    } finally {
      setIsMarkingAll(false)
    }
  }

  const hasUnread = messages.some((m) => !m.read)

  return (
    <div>
      <div className="mb-5 flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold dark:text-white">Inbox</h1>
        <Button
          variant="outline"
          className="h-8"
          disabled={!hasUnread || isMarkingAll}
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading messages...</p>
      ) : messages.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          You have no messages yet.
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <Link key={message.id} href={`/admin/messages/inbox/${message.id}`}>
              <Card
                className={cn(
                  "flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors",
                  { "border-l-4 border-l-green-600": !message.read }
                )}
              >
                {!message.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{message.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}

          {hasMore && (
            <Button
              variant="outline"
              className="h-9 mt-2"
              disabled={isLoadingMore}
              onClick={loadMore}
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default MessageInbox
