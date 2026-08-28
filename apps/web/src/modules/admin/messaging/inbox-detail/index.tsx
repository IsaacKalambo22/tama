"use client"

import { Card } from "@/components/ui/card"
import {
  fetchMessageById,
  InAppMessageProps,
  messagesBasePath,
} from "@/lib/messaging"
import { cn, formatDateTime } from "@/lib/utils"
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
  const basePath = messagesBasePath(session?.role)

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
        href={`${basePath}/inbox`}
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
        <MessageCard message={message} />
      )}
    </div>
  )
}

/**
 * The message body. When the message carries a `link`, the whole card is
 * pressable and navigates there — there is no separate "Open" action.
 */
const MessageCard = ({ message }: { message: InAppMessageProps }) => {
  const body = (
    <Card
      className={cn("p-6", {
        "transition-colors hover:bg-gray-50 dark:hover:bg-gray-900":
          !!message.link,
      })}
    >
      <h1 className="text-xl font-semibold mb-1">{message.title}</h1>
      <p className="text-xs text-muted-foreground mb-4">
        {formatDateTime(message.createdAt)}
      </p>
      <p className="whitespace-pre-wrap">{message.body}</p>
    </Card>
  )

  return message.link ? (
    <Link href={message.link} className="block">
      {body}
    </Link>
  ) : (
    body
  )
}

export default MessageDetail
