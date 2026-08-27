"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageBatchProps } from "@/lib/messaging"
import { formatDateTime } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Ban } from "lucide-react"
import { useState } from "react"
import ModalCancelBatch from "../modal-cancel-batch"

const STATUS_VARIANT: Record<string, string> = {
  DRAFT: "bg-gray-200 text-gray-800",
  SCHEDULED: "bg-amber-100 text-amber-800",
  SENT: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const TARGET_LABELS: Record<string, string> = {
  INDIVIDUALS: "Individuals",
  GROUP: "Group",
  DISTRICT: "District",
  COUNCIL: "Council",
}

const CHANNEL_LABELS: Record<string, string> = {
  IN_APP: "In-App",
  EMAIL: "Email",
  SMS: "SMS",
}

function batchHeadline(batch: MessageBatchProps): {
  title: string
  body: string
} {
  if (batch.channels.includes("IN_APP") && batch.inAppTitle) {
    return { title: batch.inAppTitle, body: batch.inAppBody ?? "" }
  }
  if (batch.channels.includes("EMAIL") && batch.emailSubject) {
    return { title: batch.emailSubject, body: batch.emailText ?? "" }
  }
  if (batch.channels.includes("SMS") && batch.smsMessage) {
    return { title: "SMS", body: batch.smsMessage }
  }
  return { title: "(templated send)", body: "" }
}

export const messageBatchColumns: ColumnDef<MessageBatchProps>[] = [
  {
    id: "message",
    accessorFn: (batch) => batchHeadline(batch).title,
    header: "Message",
    cell: ({ row }) => {
      const { title, body } = batchHeadline(row.original)
      return (
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-xs line-clamp-1">{body}</p>
        </div>
      )
    },
  },
  {
    id: "channels",
    accessorKey: "channels",
    header: "Channels",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.channels.map((channel) => (
          <Badge key={channel} variant="outline" className="text-xs">
            {CHANNEL_LABELS[channel] ?? channel}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "targetType",
    header: "Target",
    cell: ({ row }) => (
      <span className="text-sm">{TARGET_LABELS[row.original.targetType]}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={STATUS_VARIANT[row.original.status]} variant="outline">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "reach",
    header: "Reach",
    cell: ({ row }) => {
      const {
        recipientCount = 0,
        readCount = 0,
        emailCount = 0,
        smsCount = 0,
        status,
      } = row.original
      if (status !== "SENT" && status !== "SCHEDULED") {
        return <span className="text-sm text-muted-foreground">—</span>
      }
      const parts: string[] = []
      if (row.original.channels.includes("IN_APP")) {
        parts.push(`${recipientCount} in-app · ${readCount} read`)
      }
      if (emailCount) parts.push(`${emailCount} email`)
      if (smsCount) parts.push(`${smsCount} SMS`)
      return (
        <span className="text-sm">
          {parts.length ? parts.join(" · ") : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "when",
    header: "When",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.scheduledFor
          ? formatDateTime(row.original.scheduledFor)
          : formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => <CancelCell batch={row.original} />,
  },
]

const CancelCell = ({ batch }: { batch: MessageBatchProps }) => {
  const [isCancelOpen, setCancelOpen] = useState(false)
  const canCancel = batch.status === "DRAFT" || batch.status === "SCHEDULED"

  if (!canCancel) return null

  return (
    <>
      <Button
        onClick={() => setCancelOpen(true)}
        variant="ghost"
        className="px-[0.4rem] h-8 text-red-600"
      >
        <Ban className="h-4 w-4 mr-1" /> Cancel
      </Button>
      {isCancelOpen && (
        <ModalCancelBatch
          isOpen={isCancelOpen}
          batch={batch}
          onClose={() => setCancelOpen(false)}
        />
      )}
    </>
  )
}
