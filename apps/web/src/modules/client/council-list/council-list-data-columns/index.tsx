"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CouncilListProps } from "@/lib/api"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

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
      const initials = item.council
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()

      return (
        <div className="w-full h-20 flex items-center gap-3">
          <Avatar className="w-20 h-20">
            <AvatarImage src={item.imageUrl} alt={item.council} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
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
]
