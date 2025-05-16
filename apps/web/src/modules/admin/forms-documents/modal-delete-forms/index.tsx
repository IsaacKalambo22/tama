"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { FileProps } from "@/lib/api"
import { deleteFileFromSupabase } from "@/lib/supabase"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteForm } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  file: FileProps
}

const ModalDeleteForms = ({ isOpen, onClose, file }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)
  const onSubmit = async () => {
    setIsLoading(true)
    let loadingToast: string | undefined

    try {
      // If there's a file associated with the form, delete it first from Supabase
      if (file.fileUrl) {
        console.log("Deleting file from Supabase:", file.fileUrl)
        loadingToast = toast.loading("Deleting file...")
        
        const deleteResult = await deleteFileFromSupabase(file.fileUrl)
        
        if (loadingToast) {
          toast.dismiss(loadingToast)
        }
        
        if (!deleteResult) {
          console.warn("Failed to delete file from storage, continuing with form deletion")
        } else {
          console.log("File deleted successfully from Supabase storage")
        }
      }

      const result = await deleteForm(
        file.id,
        fullPath,
        pathWithoutAdmin,
        "/admin"
      )

      onClose()
      if (result.success) {
        toast.success("Form deleted successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error deleting form:", error)
      
      // Dismiss the loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }
      
      // Show detailed error message
      toast.error("Failed to delete form", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Delete ${file.filename}`}>
      <DialogDescription>
        Are you sure you want to delete {file.filename}?
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

export default ModalDeleteForms
