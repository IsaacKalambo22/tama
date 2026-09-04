import { redirect } from "next/navigation"

const MessagesPage = () => {
  redirect("/farmer/messages/inbox")
}

export default MessagesPage
