"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UserProps } from "@/lib/api"
import { formatDateTime } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import ModalDeleteUser from "../modal-delete-user"
import ModalEditUser from "../modal-edit-user"
import ModalViewUser from "../modal-view-user"

export const userColumns: ColumnDef<UserProps>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>
    },
  },
  {
    accessorKey: "name",
    header: "User Info",
    cell: ({ row }) => {
      const userName = row.original.name
      const firstLetter = userName.charAt(0).toUpperCase()

      return (
        <div className="flex items-center gap-4">
          <Card className="flex justify-center items-center rounded-full w-10 h-10 bg-gray-200 text-gray-800 font-bold text-lg">
            {firstLetter}
          </Card>
          <div>
            <p>{userName}</p>
            <p className="text-muted-foreground text-sm w-5">
              {row.original.email}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        className="h-8 max-sm:hidden"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex ml-4 gap-2 items-center max-sm:hidden">
        {row.getValue("role")}
      </div>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => (
      <Button
        className="h-8 max-sm:hidden"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Login
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex ml-4 gap-2 items-center max-sm:hidden">
        {formatDateTime(row.getValue("lastLogin"))}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          className="h-8 max-sm:hidden"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex ml-4 gap-2 items-center">
          <div className="capitalize max-sm:hidden">
            {row.getValue("phoneNumber")}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original
      const [isEditModalOpen, setEditModalOpen] = useState(false)
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
      const [isViewModalOpen, setViewModalOpen] = useState(false)

      const { data: session } = useSession() // Get the current session

      // Extract the role from the session
      const role = session?.role // Ensure role is stored in the session
      console.log({ session })
      const handleOpenEditModal = () => setEditModalOpen(true)
      const handleCloseEditModal = () => setEditModalOpen(false)

      const handleOpenDeleteModal = () => setDeleteModalOpen(true)
      const handleCloseDeleteModal = () => setDeleteModalOpen(false)

      const handleOpenViewModal = () => setViewModalOpen(true)
      const handleCloseViewModal = () => setViewModalOpen(false)

      return (
        <div className="h-8 flex gap-1">
          <Button
            onClick={handleOpenViewModal}
            variant="ghost"
            className="px-[0.4rem] h-8 text-gray-500"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Edit button - visible only to ADMIN */}
          {role === "ADMIN" && (
            <Button
              onClick={handleOpenEditModal}
              variant="ghost"
              className="px-[0.4rem] h-8 text-gray-500"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          {/* Delete button - visible only to ADMIN */}
          {role === "ADMIN" && (
            <Button
              onClick={handleOpenDeleteModal}
              variant="ghost"
              className="px-[0.4rem] h-8"
            >
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          )}

          {isEditModalOpen && (
            <ModalEditUser
              isOpen={isEditModalOpen}
              user={user}
              onClose={handleCloseEditModal}
            />
          )}

          {isViewModalOpen && (
            <ModalViewUser
              isOpen={isViewModalOpen}
              user={user}
              onClose={handleCloseViewModal}
            />
          )}

          {isDeleteModalOpen && (
            <ModalDeleteUser
              isOpen={isDeleteModalOpen}
              user={user}
              onClose={handleCloseDeleteModal}
            />
          )}
        </div>
      )
    },
  },
]
