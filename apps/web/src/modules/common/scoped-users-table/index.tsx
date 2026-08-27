"use client"

import { UserProps } from "@/lib/api"
import { ROLE_LABELS } from "@/modules/admin/constants"
import ModalDeleteUser from "@/modules/admin/user/modal-delete-user"
import ModalEditUser from "@/modules/admin/user/modal-edit-user"
import { CustomDataTable } from "@/modules/common/custom-data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface ScopedUsersTableProps {
  users: UserProps[]
  allowedRoles?: string[]
}

const roleBadgeStyles: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
  COUNCIL_ADMIN: "bg-blue-100 text-blue-800",
  DISTRICT_ADMIN: "bg-teal-100 text-teal-800",
  FARMER: "bg-green-100 text-green-800",
}

const ScopedUsersTable = ({ users, allowedRoles }: ScopedUsersTableProps) => {
  const { data: session } = useSession()

  const columns: ColumnDef<UserProps>[] = [
    {
      header: "#",
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            roleBadgeStyles[row.original.role] || "bg-gray-100 text-gray-800"
          }`}
        >
          {ROLE_LABELS[row.original.role] || row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "districtName",
      header: "District",
      cell: ({ row }) => row.original.districtName || "-",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => row.original.phoneNumber,
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        const [isEditOpen, setEditOpen] = useState(false)
        const [isDeleteOpen, setDeleteOpen] = useState(false)
        const role = session?.role

        if (role !== "COUNCIL_ADMIN" && role !== "DISTRICT_ADMIN") {
          return null
        }

        return (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="p-2 text-red-600 hover:text-red-700"
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </button>

            {isEditOpen && (
              <ModalEditUser
                isOpen={isEditOpen}
                user={user}
                onClose={() => setEditOpen(false)}
                allowedRoles={allowedRoles}
              />
            )}
            {isDeleteOpen && (
              <ModalDeleteUser
                isOpen={isDeleteOpen}
                user={user}
                onClose={() => setDeleteOpen(false)}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <CustomDataTable
      data={users}
      columns={columns}
      filterPlaceholder="Filter users..."
      filterColumn="name"
    />
  )
}

export default ScopedUsersTable
