"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  fetchSystemFeed,
  markSystemSeen,
  SystemNotificationProps,
} from "@/lib/system-notifications"
import { formatDateTime } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

const PAGE_SIZE = 20

const SystemNotificationFeed = () => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [items, setItems] = useState<SystemNotificationProps[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadFirstPage = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const result = await fetchSystemFeed(token, { limit: PAGE_SIZE })
      setItems(result.notifications)
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
      // Visiting the feed clears the unseen badge.
      await markSystemSeen(token)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
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
      const result = await fetchSystemFeed(token, { limit: PAGE_SIZE, cursor })
      setItems((prev) => [...prev, ...result.notifications])
      setCursor(result.nextCursor)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("Failed to fetch more notifications:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold dark:text-white">
        Notifications
      </h1>
      <p className="mb-5 text-sm text-muted-foreground">
        System-wide announcements — new blog posts, events, vacancies and
        publications.
      </p>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          Nothing has been announced yet.
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const card = (
              <Card className="p-4 transition-colors hover:bg-gray-50">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </p>
              </Card>
            )
            return item.link ? (
              <Link key={item.id} href={item.link}>
                {card}
              </Link>
            ) : (
              <div key={item.id}>{card}</div>
            )
          })}

          {hasMore && (
            <Button
              variant="outline"
              className="mt-2 h-9"
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

export default SystemNotificationFeed
