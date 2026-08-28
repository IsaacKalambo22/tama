"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { fetchSupportThreads, SupportThreadSummary } from "@/lib/support"
import { cn, formatDateTime } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import NewSupportRequest from "./new-support-request"

type Props = {
  /** Route prefix for a thread link, e.g. "/farmer/support" or "/admin/support". */
  basePath: string
  /** Managers see the farmer's name and no "new request" button. */
  variant: "farmer" | "manager"
}

const StatusBadge = ({ status }: { status: SupportThreadSummary["status"] }) =>
  status === "RESOLVED" ? (
    <Badge variant="secondary">Resolved</Badge>
  ) : (
    <Badge className="bg-green-600 hover:bg-green-600">Open</Badge>
  )

const SupportList = ({ basePath, variant }: Props) => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [threads, setThreads] = useState<SupportThreadSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      setThreads(await fetchSupportThreads(token))
    } catch (error) {
      console.error("Failed to load support requests:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <div className="mb-5 flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold dark:text-white">
          {variant === "manager" ? "Farmer Support Requests" : "Support & Help"}
        </h1>
        {variant === "farmer" && <NewSupportRequest onCreated={load} />}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading requests...</p>
      ) : threads.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          {variant === "manager"
            ? "No support requests from your farmers yet."
            : "You haven't asked for help yet. Start a request when you have a question or something to report."}
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {threads.map((thread) => (
            <Link key={thread.id} href={`${basePath}/${thread.id}`}>
              <Card
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900",
                  { "border-l-4 border-l-green-600": thread.unreadCount > 0 }
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{thread.subject}</p>
                    <StatusBadge status={thread.status} />
                    {thread.unreadCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  {variant === "manager" && (
                    <p className="text-xs text-muted-foreground">
                      {thread.farmer.name}
                      {thread.farmer.district
                        ? ` · ${thread.farmer.district}`
                        : thread.farmer.council
                          ? ` · ${thread.farmer.council}`
                          : ""}
                    </p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {thread.lastMessage}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(thread.lastMessageAt)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SupportList
