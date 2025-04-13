import { NewsProps } from "@/lib/api"
import NewsCard from "../news-card"

interface Props {
  news: NewsProps[]
}
const NewsList = ({ news }: Props) => {
  return (
    <div className="grid mt-5 sm:mt-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} newsItem={item} />
      ))}
    </div>
  )
}

export default NewsList
