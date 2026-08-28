import { redirect } from "next/navigation"

const MessagesPage = () => {
  redirect("/district-admin/messages/inbox")
}

export default MessagesPage
