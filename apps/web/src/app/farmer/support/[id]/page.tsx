import SupportThread from "@/modules/common/support/support-thread"

interface Props {
  params: {
    id: string
  }
}

const FarmerSupportThreadPage = async ({ params }: Props) => {
  const id = (await params).id

  return <SupportThread id={id} basePath="/farmer/support" variant="farmer" />
}

export default FarmerSupportThreadPage
