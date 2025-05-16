"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { CouncilListProps } from "@/lib/api"
import { deleteFileFromSupabase } from "@/lib/supabase"
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
    let loadingToast: string | undefined

    try {
      // If there's an image associated with the council list, delete it first
      if (councilList.imageUrl) {
        console.log("Deleting file:", councilList.imageUrl)
        loadingToast = toast.loading("Deleting image...")
        
        await deleteFileFromSupabase(councilList.imageUrl)
        
        if (loadingToast) {
          toast.dismiss(loadingToast)
        }
      }

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
    } catch (error) {
      console.error("Error deleting council list:", error)
      
      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Show detailed error message
      toast.error("Failed to delete council list", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
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
