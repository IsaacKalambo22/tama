"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { toast } from "@/hooks/use-toast"
import { TeamProps } from "@/lib/api"
import { deleteFileFromSupabase } from "@/lib/supabase"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { deleteTeam } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  team: TeamProps
}

const ModalDeleteTeam = ({ isOpen, onClose, team }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)
  const onSubmit = async () => {
    setIsLoading(true)

    try {
      // If there's an image associated with the team member, delete it first from Supabase
      if (team.imageUrl) {
        await deleteFileFromSupabase(team.imageUrl)
      }

      const result = await deleteTeam(
        team.id,
        fullPath,
        pathWithoutAdmin,
        "/admin"
      )

      onClose()
      toast({
        title: "Success",
        description: `${team.name} has been deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error has occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Delete ${team.name}`}>
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

export default ModalDeleteTeam
