import { redirect } from "next/navigation"

const MessagesPage = () => {
  redirect("/admin/messages/inbox")
}

export default MessagesPage
