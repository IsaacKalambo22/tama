"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { NotificationBatchProps } from "@/lib/notifications"
import { cancelNotificationBatch } from "@/modules/admin/actions"
import Modal from "@/modules/admin/modal"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  isOpen: boolean
  onClose: () => void
  batch: NotificationBatchProps
}

const ModalCancelBatch = ({ isOpen, onClose, batch }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)

  const onSubmit = async () => {
    setIsLoading(true)

    const result = await cancelNotificationBatch(
      batch.id,
      fullPath,
      pathWithoutAdmin
    )

    onClose()
    if (result.success) {
      toast.success("Notification batch cancelled")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Cancel "${batch.title}"`}>
      <DialogDescription>
        {batch.status === "SCHEDULED"
          ? "This scheduled notification will not be sent."
          : "This draft notification will be discarded."}{" "}
        This cannot be undone.
      </DialogDescription>
      <DialogFooter className="flex flex-col gap-3 md:flex-row">
        <DialogClose asChild>
          <Button type="button" className="h-9" variant="secondary">
            Keep it
          </Button>
        </DialogClose>
        <CustomButton
          isLoading={isLoading}
          loadingText="Cancelling..."
          variant={BUTTON_VARIANT.DESTRUCTIVE}
          className="h-9"
          onClick={onSubmit}
        >
          Cancel notification
        </CustomButton>
      </DialogFooter>
    </Modal>
  )
}

export default ModalCancelBatch
