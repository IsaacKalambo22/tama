"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserProps } from "@/lib/api"
import { ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"

type Props = {
  users: UserProps[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

const MultiUserSelect = ({ users, selectedIds, onChange }: Props) => {
  const [search, setSearch] = useState("")

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }, [users, search])

  const toggleUser = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId))
    } else {
      onChange([...selectedIds, userId])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between h-10 font-normal"
        >
          {selectedIds.length > 0
            ? `${selectedIds.length} recipient${selectedIds.length > 1 ? "s" : ""} selected`
            : "Select individuals"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-2" align="start">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 mb-2"
        />
        <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2 text-center">
              No users found.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <label
                key={user.id}
                htmlFor={`user-${user.id}`}
                className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedIds.includes(user.id)}
                  onCheckedChange={() => toggleUser(user.id)}
                />
                <span className="flex-1 truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </span>
              </label>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MultiUserSelect
