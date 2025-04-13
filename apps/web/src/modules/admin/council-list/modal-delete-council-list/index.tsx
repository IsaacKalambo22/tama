"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { CouncilListProps } from "@/lib/api"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteCouncilList } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  councilList: CouncilListProps
}

const ModalDeleteCouncilList = ({ isOpen, onClose, councilList }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const onSubmit = async () => {
    setIsLoading(true)

    const result = await deleteCouncilList(
      councilList.id,
      fullPath,
      "/resources/council-list",
      "/admin"
    )

    onClose()
    if (result.success) {
      toast.success("Council list deleted successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Delete ${councilList.council}`}
    >
      <DialogDescription>
        Are you sure you want to delete {councilList.council}?
      </DialogDescription>
      <DialogFooter className="flex flex-col gap-3 md:flex-row">
        <DialogClose asChild>
          <Button type="button" className="h-9" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <CustomButton
          isLoading={isLoading}
          loadingText="Deleting..."
          variant={BUTTON_VARIANT.DESTRUCTIVE}
          className="h-9"
          onClick={onSubmit}
        >
          Confirm
        </CustomButton>
      </DialogFooter>
    </Modal>
  )
}

export default ModalDeleteCouncilList
