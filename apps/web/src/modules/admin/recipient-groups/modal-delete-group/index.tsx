"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { RecipientGroupProps } from "@/lib/messaging"
import { deleteRecipientGroup } from "@/modules/admin/actions"
import Modal from "@/modules/admin/modal"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onClose: () => void
  group: RecipientGroupProps
}

const ModalDeleteGroup = ({ isOpen, onClose, group }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const onSubmit = async () => {
    setIsLoading(true)

    const result = await deleteRecipientGroup(
      group.id,
      fullPath,
      pathWithoutAdmin
    )

    onClose()
    if (result.success) {
      toast.success("Recipient group deleted successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Delete ${group.name}`}>
      <DialogDescription>
        Are you sure you want to delete "{group.name}"? Notifications already
        sent to this group are unaffected.
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

export default ModalDeleteGroup
