import CustomWhoWeAreContent from "@/modules/client/who-we-are/custom-who-we-are-content"
import HeaderText from "@/modules/common/header-text"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Who We Are - TAMA Farmers Trust",
  description:
    "Learn about TAMA Farmers Trust, our mission, vision, and commitment to the tobacco farming community.",
}

const WhoWeArePage = () => {
  return (
    <div className="flex w-full flex-col gap-10 mb-16">
      <HeaderText
        title="Who We Are"
        subtitle="Discover our story, mission, and commitment to tobacco farmers"
      />

      <CustomWhoWeAreContent />
    </div>
  )
}

export default WhoWeArePage
