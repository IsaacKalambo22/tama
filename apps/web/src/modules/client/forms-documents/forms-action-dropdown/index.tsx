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

import { FileProps } from "@/lib/api"
import { clientActionsDropdownItems } from "@/modules/admin/constants"
import CustomDownloadButton from "@/modules/common/custom-download-button"
import Image from "next/image"
import { useState } from "react"
import ModalViewForms from "../modal-view-forms"
type Props = {
  file: FileProps
}
const FormsActionDropdown = ({ file }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)

  const renderDialogContent = () => {
    if (!action) return null

    const { value } = action

    if (value === "details") {
      return (
        <ModalViewForms
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          file={file}
        />
      )
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <div className="rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-md shadow-md p-2">
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
            {file.filename}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {clientActionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem)

                if (["details"].includes(actionItem.value)) {
                  setIsModalOpen(true)
                }
              }}
            >
              {actionItem.value === "download" ? (
                <CustomDownloadButton
                  fileName={file.filename}
                  fileUrl={file.fileUrl}
                />
              ) : (
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
export default FormsActionDropdown
