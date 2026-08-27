"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fetchMessageById, InAppMessageProps } from "@/lib/messaging"
import { formatDateTime } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Props = {
  id: string
}

const MessageDetail = ({ id }: Props) => {
  const { data: session } = useSession()
  const token = session?.accessToken

  const [message, setMessage] = useState<InAppMessageProps | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    ;(async () => {
      setIsLoading(true)
      try {
        // The GET marks the message read as a side effect — see
        // apps/api/src/controllers/inbox#getInboxMessage.
        setMessage(await fetchMessageById(token, id))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load message")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [token, id])

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/messages/inbox"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inbox
      </Link>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : error || !message ? (
        <Card className="p-6 text-center text-red-500">
          {error || "Message not found."}
        </Card>
      ) : (
        <Card className="p-6">
          <h1 className="text-xl font-semibold mb-1">{message.title}</h1>
          <p className="text-xs text-muted-foreground mb-4">
            {formatDateTime(message.createdAt)}
          </p>
          <p className="whitespace-pre-wrap">{message.body}</p>
          {message.link && (
            <Button asChild className="mt-5">
              <Link href={message.link}>Open</Link>
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}

export default MessageDetail
