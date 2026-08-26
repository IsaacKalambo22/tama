"use client"

import { Button } from "@/components/ui/button"
import { PlusSquare } from "lucide-react"
import { useState } from "react"
import ModalNewGroup from "../modal-new-group"

const RecipientGroupsHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1 className="text-lg font-semibold dark:text-white">
        Recipient Groups
      </h1>
      <Button onClick={() => setIsOpen(true)}>
        <PlusSquare className="h-4 w-4" />
        New Group
      </Button>
      {isOpen && (
        <ModalNewGroup isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  )
}

export default RecipientGroupsHeader
