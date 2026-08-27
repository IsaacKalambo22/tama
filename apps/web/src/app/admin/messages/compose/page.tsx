import MessageComposer from "@/modules/admin/messaging/message-composer"

const ComposeMessagePage = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-5 dark:text-white">
        New Message
      </h1>
      <MessageComposer />
    </div>
  )
}

export default ComposeMessagePage
