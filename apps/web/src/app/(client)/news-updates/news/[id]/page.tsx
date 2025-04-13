import NewsDetail from "@/modules/client/news/news-detail"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "News Details - TAMA Farmers Trust",
  description: "Read the latest news from TAMA Farmers Trust.",
}

interface NewsPageProps {
  params: {
    id: string // The news ID will be passed as a string in the params
  }
}

const NewsDetailsPage = async ({ params }: NewsPageProps) => {
  const id = (await params).id // Extract the news ID from the params

  return <NewsDetail id={id} />
}

export default NewsDetailsPage
