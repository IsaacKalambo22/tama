"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NotificationBatchProps } from "@/lib/notifications"
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

export const notificationBatchColumns: ColumnDef<NotificationBatchProps>[] = [
  {
    accessorKey: "title",
    header: "Notification",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-muted-foreground text-xs line-clamp-1">
          {row.original.body}
        </p>
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
      const { recipientCount = 0, readCount = 0, status } = row.original
      if (status === "SENT") {
        return (
          <span className="text-sm">
            {recipientCount} recipients · {readCount} read
          </span>
        )
      }
      return <span className="text-sm text-muted-foreground">—</span>
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
    cell: ({ row }) => {
      const batch = row.original
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
    },
  },
]
