import MessageBatchTable from "@/modules/admin/messaging/message-batch-table"
import Link from "next/link"

const MessageBatchesPage = () => {
  return (
    <div>
      <div className="mb-5 flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold dark:text-white">
          Sent &amp; Scheduled
        </h1>
        <Link
          href="/district-admin/messages/compose"
          className="text-sm font-medium text-primary hover:underline"
        >
          + New Message
        </Link>
      </div>
      <MessageBatchTable />
    </div>
  )
}

export default MessageBatchesPage
