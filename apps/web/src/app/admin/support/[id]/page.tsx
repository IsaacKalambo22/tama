import SupportThread from "@/modules/common/support/support-thread"

interface Props {
  params: {
    id: string
  }
}

const AdminSupportThreadPage = async ({ params }: Props) => {
  const id = (await params).id

  return <SupportThread id={id} basePath="/admin/support" variant="manager" />
}

export default AdminSupportThreadPage
