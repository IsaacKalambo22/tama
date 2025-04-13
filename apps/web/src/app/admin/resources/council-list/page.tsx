import CustomCouncilList from "@/modules/admin/council-list/custom-council-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Council List - TAMA Farmers Trust",
  description: "View the list of council members at TAMA Farmers Trust.",
}
const CouncilListPage = () => {
  return <CustomCouncilList />
}

export default CouncilListPage
