"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import useCustomPath from "@/hooks/use-custom-path"
import { NewsProps } from "@/lib/api"
import { deleteFileFromSupabase } from "@/lib/supabase"
import CustomButton, { BUTTON_VARIANT } from "@/modules/common/custom-button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteNews } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  news: NewsProps
}

const ModalDeleteNews = ({ isOpen, onClose, news }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const onSubmit = async () => {
    setIsLoading(true)

    try {
      // If there's an image associated with the news, delete it first
      if (news.imageUrl) {
        console.log("Deleting file:", news.imageUrl)
        await deleteFileFromSupabase(news.imageUrl)
      }

      const result = await deleteNews(
        news.id,
        fullPath,
        "/news-updates-news",
        "/admin"
      )

      onClose()
      if (result.success) {
        toast.success("News deleted successfully")
      } else {
        toast.error(result.error ?? "An error occurred.")
      }
    } catch (error) {
      console.error("Error deleting news:", error)
      toast.error("Failed to delete news", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Delete ${news.title}`}>
      <DialogDescription>
        Are you sure you want to delete {news.title}?
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

export default ModalDeleteNews
