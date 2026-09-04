import SupportThread from "@/modules/common/support/support-thread"

interface Props {
  params: {
    id: string
  }
}

const DistrictAdminSupportThreadPage = async ({ params }: Props) => {
  const id = (await params).id

  return (
    <SupportThread
      id={id}
      basePath="/district-admin/support"
      variant="manager"
    />
  )
}

export default DistrictAdminSupportThreadPage
