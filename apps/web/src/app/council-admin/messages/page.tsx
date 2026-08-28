import { redirect } from "next/navigation"

const MessagesPage = () => {
  redirect("/council-admin/messages/inbox")
}

export default MessagesPage
