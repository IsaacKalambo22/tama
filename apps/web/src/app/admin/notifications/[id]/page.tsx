import NotificationDetail from "@/modules/admin/notifications/inbox-detail"

interface NotificationDetailPageProps {
  params: {
    id: string
  }
}

const NotificationDetailPage = async ({
  params,
}: NotificationDetailPageProps) => {
  const id = (await params).id

  return <NotificationDetail id={id} />
}

export default NotificationDetailPage
