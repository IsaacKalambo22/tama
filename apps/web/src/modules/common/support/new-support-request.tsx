"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createSupportRequest } from "@/lib/support"
import { LifeBuoy } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  /** Called after a request is created (e.g. to refresh a list). */
  onCreated?: () => void
}

const NewSupportRequest = ({ onCreated }: Props) => {
  const { data: session } = useSession()
  const token = session?.accessToken
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = subject.trim().length >= 3 && message.trim().length >= 3

  const handleSubmit = async () => {
    if (!canSubmit || !token) return
    setIsSubmitting(true)
    try {
      const { id } = await createSupportRequest(token, {
        subject: subject.trim(),
        message: message.trim(),
      })
      toast.success("Your request has been sent to your manager.")
      setOpen(false)
      setSubject("")
      setMessage("")
      onCreated?.()
      router.push(`/farmer/support/${id}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send your request."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 gap-2">
          <LifeBuoy className="h-4 w-4" />
          New request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask for help</DialogTitle>
          <DialogDescription>
            Send a question or report an issue to your district manager. They
            will reply here.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question about my council registration"
              maxLength={120}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              What do you need help with?
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or the problem..."
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="h-10 w-full"
          >
            {isSubmitting ? "Sending..." : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewSupportRequest
