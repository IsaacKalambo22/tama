"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { removeFromS3 } from "@/lib/aws"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteHomeCarousel } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  homeCarousel: HomeCarousel
}

const ModalDeleteHomeCarousel = ({ isOpen, onClose, homeCarousel }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)

  const onSubmit = async () => {
    setIsLoading(true)

    const result = await deleteHomeCarousel(
      homeCarousel.id,
      fullPath,
      "/admin",
      "/"
    )
    if (result.success) {
      await removeFromS3(homeCarousel.coverUrl)
      toast.success("HomeCarousel deleted successfully")
      onClose()
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Delete HomeCarousel`}>
      <DialogDescription>
        Are you sure you want to delete this homeCarousel?
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

export default ModalDeleteHomeCarousel
