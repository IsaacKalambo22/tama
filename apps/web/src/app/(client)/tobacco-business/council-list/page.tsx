import CouncilList from "@/modules/client/council-list"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Council List - TAMA Farmers Trust",
  description: "View the list of council members at TAMA Farmers Trust.",
}

const CouncilListPage = () => {
  return <CouncilList />
}

export default CouncilListPage
