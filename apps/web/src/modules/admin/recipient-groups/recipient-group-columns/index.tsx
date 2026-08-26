"use client"

import { Button } from "@/components/ui/button"
import { RecipientGroupProps } from "@/lib/notifications"
import { formatDateTime } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import { useState } from "react"
import ModalDeleteGroup from "../modal-delete-group"

export const recipientGroupColumns: ColumnDef<RecipientGroupProps>[] = [
  {
    accessorKey: "name",
    header: "Group Name",
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    cell: ({ row }) => <span>{row.original.memberCount ?? 0}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => <span>{formatDateTime(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const group = row.original
      const [isDeleteOpen, setDeleteOpen] = useState(false)

      return (
        <>
          <Button
            onClick={() => setDeleteOpen(true)}
            variant="ghost"
            className="px-[0.4rem] h-8"
          >
            <Trash className="h-4 w-4 text-red-600" />
          </Button>
          {isDeleteOpen && (
            <ModalDeleteGroup
              isOpen={isDeleteOpen}
              group={group}
              onClose={() => setDeleteOpen(false)}
            />
          )}
        </>
      )
    },
  },
]
