import NotificationComposer from "@/modules/admin/notifications/notification-composer"

const ComposeNotificationPage = () => {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-5 dark:text-white">
        New Notification
      </h1>
      <NotificationComposer />
    </div>
  )
}

export default ComposeNotificationPage
