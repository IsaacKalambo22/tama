import SupportThread from "@/modules/common/support/support-thread"

interface Props {
  params: {
    id: string
  }
}

const CouncilAdminSupportThreadPage = async ({ params }: Props) => {
  const id = (await params).id

  return (
    <SupportThread
      id={id}
      basePath="/council-admin/support"
      variant="manager"
    />
  )
}

export default CouncilAdminSupportThreadPage
