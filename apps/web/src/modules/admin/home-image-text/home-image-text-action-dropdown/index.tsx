"use client"

import { Dialog } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Image from "next/image"
import { useState } from "react"
import { adminActionsDropdownItems } from "../../constants"
import ModalDeleteHomeImageText from "../modal-delete-home-image-text"
import ModalEditHomeImageText from "../modal-edit-home-carousel"
type Props = {
  homeImageText: HomeImageText
}
const HomeImageTextActionDropdown = ({ homeImageText }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)

  const renderDialogContent = () => {
    if (!action) return null

    const { value } = action

    if (value === "edit") {
      return (
        <ModalEditHomeImageText
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          homeImageText={homeImageText}
        />
      )
    }

    if (value === "delete") {
      return (
        <ModalDeleteHomeImageText
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          homeImageText={homeImageText}
        />
      )
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <div className="rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-md shadow-md p-2 z-50">
            <Image
              src="/assets/icons/dots.svg"
              alt="dots"
              width={18}
              height={18}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {homeImageText.heading}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {adminActionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem)

                if (["edit", "delete", "details"].includes(actionItem.value)) {
                  setIsModalOpen(true)
                }
              }}
            >
              {actionItem.value && (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  )
}
export default HomeImageTextActionDropdown
