import MessageDetail from "@/modules/admin/messaging/inbox-detail"

interface MessageDetailPageProps {
  params: {
    id: string
  }
}

const MessageDetailPage = async ({ params }: MessageDetailPageProps) => {
  const id = (await params).id

  return <MessageDetail id={id} />
}

export default MessageDetailPage
