import News from "@/modules/admin/news"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin News - TAMA Farmers Trust",
  description: "Manage and publish news and updates for TAMA Farmers Trust.",
}

const NewsPage = () => {
  return <News />
}

export default NewsPage
