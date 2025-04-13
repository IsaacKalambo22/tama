import ReportsAndPublications from "@/modules/admin/reports-publications"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reports and Publications - TAMA Farmers Trust",
  description:
    "Explore detailed reports and publications provided by TAMA Farmers Trust.",
}

const ReportsAndPublicationsPage = () => {
  return <ReportsAndPublications />
}

export default ReportsAndPublicationsPage
