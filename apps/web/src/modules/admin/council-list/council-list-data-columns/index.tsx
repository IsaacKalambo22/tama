"use client"

import { Button } from "@/components/ui/button"
import { CouncilListProps } from "@/lib/api"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react"
import { useState } from "react"
import ModalDeleteCouncilList from "../modal-delete-council-list"
import ModalEditCouncilList from "../modal-edit-council-list"
import ModalViewCouncilList from "../modal-view-council-list"

export const councilListDataColumns: ColumnDef<CouncilListProps>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>
    },
  },
  {
    accessorKey: "councilArea",
    header: ({ column }) => {
      return (
        <Button
          className="h-8 max-sm:hidden"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Councillor
          <ArrowUpDown className="ml-2 h-4 w-4 " />
        </Button>
      )
    },
    cell: ({ row }) => {
      const item = row.original
      return (
        <div className="w-full h-20 flex items-center gap-3">
          <div className="w-20 h-20 overflow-hidden rounded-full">
            <img
              src={item.imageUrl}
              alt={item.council}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{item.council}</div>
            <span className="mt-0.5 text-xs text-muted-foreground">
              {item.councilArea}
            </span>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: "firstAlternateCouncillor",
    header: ({ column }) => {
      return (
        <Button
          className="h-8 max-sm:hidden"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Alternate Councillor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex ml-4 gap-2 items-center">
          <div className="capitalize">
            {row.getValue("firstAlternateCouncillor")}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "secondAlternateCouncillor",
    header: ({ column }) => {
      return (
        <Button
          className="h-8 max-sm:hidden"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Second Alternate Councillor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex ml-4 gap-2 items-center">
          <div className="capitalize">
            {row.getValue("secondAlternateCouncillor")}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "demarcation",
    header: ({ column }) => {
      return (
        <Button
          className="h-8"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Demarcation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex ml-4 gap-2 items-center">
          <div className="capitalize">{row.getValue("demarcation")}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => {
      const councilList = row.original // Get the councilList data for this row
      const [isEditModalOpen, setEditModalOpen] = useState(false)
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
      const [isViewModalOpen, setViewModalOpen] = useState(false)

      // Handlers for opening and closing modals
      const handleOpenEditModal = () => setEditModalOpen(true)
      const handleCloseEditModal = () => setEditModalOpen(false)

      const handleOpenDeleteModal = () => setDeleteModalOpen(true)
      const handleCloseDeleteModal = () => setDeleteModalOpen(false)

      const handleOpenViewModal = () => setViewModalOpen(true)
      const handleCloseViewModal = () => setViewModalOpen(false)

      return (
        <div className="h-8 flex gap-1">
          {/* View Button */}
          <Button
            onClick={handleOpenViewModal}
            variant="ghost"
            className="px-[0.4rem] h-8 text-gray-500"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Edit Button */}
          <Button
            onClick={handleOpenEditModal}
            variant="ghost"
            className="px-[0.4rem] h-8 text-gray-500"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete Button */}
          <Button
            onClick={handleOpenDeleteModal}
            variant="ghost"
            className="px-[0.4rem] h-8"
          >
            <Trash className="h-4 w-4 text-red-600" />
          </Button>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <ModalEditCouncilList
              isOpen={isEditModalOpen}
              councilList={councilList} // Pass the selected councilList data
              onClose={handleCloseEditModal} // Callback to close the modal
            />
          )}

          {/* View Modal */}
          {isViewModalOpen && (
            <ModalViewCouncilList
              isOpen={isViewModalOpen}
              councilList={councilList}
              onClose={handleCloseViewModal}
            />
          )}

          {/* Delete Modal */}
          {isDeleteModalOpen && (
            <ModalDeleteCouncilList
              isOpen={isDeleteModalOpen}
              councilList={councilList}
              onClose={handleCloseDeleteModal}
            />
          )}
        </div>
      )
    },
  },
]
