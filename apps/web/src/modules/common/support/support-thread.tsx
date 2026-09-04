"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  fetchSupportThread,
  replySupportThread,
  setSupportThreadStatus,
  SupportThread as SupportThreadData,
} from "@/lib/support"
import { cn, formatDateTime } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
  id: string
  /** Where the "back" link points, e.g. "/farmer/support". */
  basePath: string
  variant: "farmer" | "manager"
}

const SupportThread = ({ id, basePath, variant }: Props) => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [thread, setThread] = useState<SupportThreadData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reply, setReply] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    try {
      setThread(await fetchSupportThread(token, id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load request")
    } finally {
      setIsLoading(false)
    }
  }, [token, id])

  useEffect(() => {
    load()
  }, [load])

  const handleReply = async () => {
    if (reply.trim().length === 0 || !token) return
    setIsSending(true)
    try {
      await replySupportThread(token, id, reply.trim())
      setReply("")
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply")
    } finally {
      setIsSending(false)
    }
  }

  const handleStatus = async (next: "SENT" | "RESOLVED") => {
    if (!token) return
    setIsUpdatingStatus(true)
    try {
      await setSupportThreadStatus(token, id, next)
      await load()
      toast.success(
        next === "RESOLVED" ? "Marked as resolved" : "Request reopened"
      )
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status"
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href={basePath}
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to requests
      </Link>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : error || !thread ? (
        <Card className="p-6 text-center text-red-500">
          {error || "Request not found."}
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">{thread.subject}</h1>
              <p className="text-xs text-muted-foreground">
                {variant === "manager"
                  ? `${thread.farmer.name}${
                      thread.farmer.district
                        ? ` · ${thread.farmer.district}`
                        : thread.farmer.council
                          ? ` · ${thread.farmer.council}`
                          : ""
                    } · `
                  : ""}
                opened {formatDateTime(thread.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {thread.status === "RESOLVED" ? (
                <Badge variant="secondary">Resolved</Badge>
              ) : (
                <Badge className="bg-green-600 hover:bg-green-600">Open</Badge>
              )}
              {variant === "manager" && (
                <Button
                  variant="outline"
                  className="h-8"
                  disabled={isUpdatingStatus}
                  onClick={() =>
                    handleStatus(
                      thread.status === "RESOLVED" ? "SENT" : "RESOLVED"
                    )
                  }
                >
                  {thread.status === "RESOLVED" ? "Reopen" : "Mark resolved"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {thread.posts.map((post, index) => (
              <Card
                key={index}
                className={cn("p-4", {
                  "border-l-4 border-l-green-600 bg-green-50/40 dark:bg-green-950/20":
                    post.mine,
                })}
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {post.mine ? "You" : post.authorName}
                    {post.authorRole && post.authorRole !== "FARMER" && (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (Manager)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(post.createdAt)}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-sm">{post.body}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-4 flex flex-col gap-2 p-4">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
            />
            <Button
              className="h-9 self-end"
              disabled={reply.trim().length === 0 || isSending}
              onClick={handleReply}
            >
              {isSending ? "Sending..." : "Send reply"}
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}

export default SupportThread
