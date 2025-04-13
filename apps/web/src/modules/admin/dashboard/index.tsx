import { Card } from "@/components/ui/card"
import {
  fetchBlogs,
  fetchCouncilList,
  fetchEvents,
  fetchFormsAndDocuments,
  fetchNews,
  fetchReportsAndPublications,
  fetchShops,
  fetchUsers,
} from "@/lib/api"
import { formatCount } from "@/lib/utils"
import AddNewHeader from "@/modules/admin/add-new-header"
import { Calendar } from "lucide-react"
import {
  FaBook,
  FaClipboard,
  FaListAlt,
  FaNewspaper,
  FaRegCommentDots,
  FaStore,
  FaUsers,
} from "react-icons/fa"

interface AdminStats {
  title: string
  count: number
  icon: React.ReactNode
}

const stats: AdminStats[] = [
  {
    title: "Shops",
    count: 23, // Mocked value will be replaced by fetched data
    icon: <FaStore size={30} className="text-blue-500" />,
  },
  {
    title: "Forms",
    count: 12, // Mocked value will be replaced by fetched data
    icon: <FaClipboard size={30} className="text-green-500" />,
  },
  {
    title: "Blogs",
    count: 7, // Mocked value will be replaced by fetched data
    icon: <FaRegCommentDots size={30} className="text-orange-500" />,
  },
  {
    title: "News",
    count: 15, // Mocked value will be replaced by fetched data
    icon: <FaNewspaper size={30} className="text-red-500" />,
  },
  {
    title: "Users",
    count: 1024, // Mocked value will be replaced by fetched data
    icon: <FaUsers size={30} className="text-purple-500" />,
  },

  {
    title: " Publications",
    count: 8, // Mocked value will be replaced by fetched data
    icon: <FaBook size={30} className="text-yellow-500" />,
  },
  {
    title: "Council Lists",
    count: 5, // Mocked value will be replaced by fetched data
    icon: <FaListAlt size={30} className="text-indigo-500" />,
  },
  {
    title: "Events",
    count: 5, // Mocked value will be replaced by fetched data
    icon: <Calendar size={30} className="text-green-500" />,
  },
]

export default async function Dashboard() {
  // Fetch all required data
  const [blogs, shops, reports, forms, councilLists, news, users, events] =
    await Promise.all([
      fetchBlogs(),
      fetchShops(),
      fetchReportsAndPublications(),
      fetchFormsAndDocuments(),
      fetchCouncilList(),
      fetchNews(),
      fetchUsers(),
      fetchEvents(),
    ])

  // Update the stats with fetched data or fallback to the mocked value
  const updatedStats = stats.map((stat) => {
    switch (stat.title) {
      case "Shops":
        stat.count = shops?.length || 0
        break
      case "Forms":
        stat.count = forms?.length || 0
        break
      case "Blogs":
        stat.count = blogs?.length || 0
        break
      case "News":
        stat.count = news?.length || 0
        break
      case "Users":
        stat.count = users?.length || 0
        break
      case " Publications":
        stat.count = reports?.length || 0
        break
      case "Council Lists":
        stat.count = councilLists?.length || 0
        break
      case "Events":
        stat.count = events?.length || 0
        break
      default:
        break
    }
    return stat
  })

  return (
    <section className="flex flex-col">
      <AddNewHeader name="Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {updatedStats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-none rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-50 rounded-lg">{stat.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-600">
                  {formatCount(stat.count)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
