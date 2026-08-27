import NotificationBatchTable from "@/modules/admin/notifications/notification-batch-table"
import Link from "next/link"

const NotificationBatchesPage = () => {
  return (
    <div>
      <div className="mb-5 flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold dark:text-white">
          Sent & Scheduled Notifications
        </h1>
        <Link
          href="/admin/notifications/compose"
          className="text-sm font-medium text-primary hover:underline"
        >
          + New Notification
        </Link>
      </div>
      <NotificationBatchTable />
    </div>
  )
}

export default NotificationBatchesPage
