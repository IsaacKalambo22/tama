"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { deleteFileFromSupabase } from "@/lib/supabase"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteHomeImageText } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  homeImageText: HomeImageText
}

const ModalDeleteHomeImageText = ({
  isOpen,
  onClose,
  homeImageText,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      // If there's an image associated with the home image text, delete it first from Supabase
      if (homeImageText.imageUrl) {
        await deleteFileFromSupabase(homeImageText.imageUrl)
      }

      const result = await deleteHomeImageText(
        homeImageText.id,
        fullPath,
        "/admin",
        "/"
      )

      onClose()
      if (result.success) {
        toast.success("Home image text deleted successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error deleting home image text:", error)
      toast.error("Failed to delete home image text", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Delete HomeImageText`}>
      <DialogDescription>Are you sure you want to delete?</DialogDescription>
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

export default ModalDeleteHomeImageText
