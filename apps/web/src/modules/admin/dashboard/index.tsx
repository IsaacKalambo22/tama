import { auth } from "@/auth"
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
  accent: string
  cardClass: string
}

const stats: AdminStats[] = [
  {
    title: "Shops",
    count: 23,
    icon: <FaStore size={22} className="text-sky-600" />,
    accent: "bg-sky-100",
    cardClass: "from-sky-50/80 via-sky-50/60 to-white/80",
  },
  {
    title: "Forms",
    count: 12,
    icon: <FaClipboard size={22} className="text-emerald-600" />,
    accent: "bg-emerald-100",
    cardClass: "from-emerald-50/80 via-emerald-50/60 to-white/80",
  },
  {
    title: "Blogs",
    count: 7,
    icon: <FaRegCommentDots size={22} className="text-amber-600" />,
    accent: "bg-amber-100",
    cardClass: "from-amber-50/80 via-amber-50/60 to-white/80",
  },
  {
    title: "News",
    count: 15,
    icon: <FaNewspaper size={22} className="text-rose-600" />,
    accent: "bg-rose-100",
    cardClass: "from-rose-50/80 via-rose-50/60 to-white/80",
  },
  {
    title: "Users",
    count: 1024,
    icon: <FaUsers size={22} className="text-violet-600" />,
    accent: "bg-violet-100",
    cardClass: "from-violet-50/80 via-violet-50/60 to-white/80",
  },
  {
    title: "Publications",
    count: 8,
    icon: <FaBook size={22} className="text-orange-600" />,
    accent: "bg-orange-100",
    cardClass: "from-orange-50/80 via-orange-50/60 to-white/80",
  },
  {
    title: "Council Lists",
    count: 5,
    icon: <FaListAlt size={22} className="text-indigo-600" />,
    accent: "bg-indigo-100",
    cardClass: "from-indigo-50/80 via-indigo-50/60 to-white/80",
  },
  {
    title: "Events",
    count: 5,
    icon: <Calendar size={22} className="text-teal-600" />,
    accent: "bg-teal-100",
    cardClass: "from-teal-50/80 via-teal-50/60 to-white/80",
  },
]

export default async function Dashboard() {
  const session = await auth()
  const token = session?.accessToken

  const [blogs, shops, reports, forms, councilLists, news, users, events] =
    await Promise.all([
      fetchBlogs(),
      fetchShops(),
      fetchReportsAndPublications(),
      fetchFormsAndDocuments(),
      fetchCouncilList(),
      fetchNews(),
      fetchUsers(token),
      fetchEvents(),
    ])

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
      case "Publications":
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

  const totalRecords = updatedStats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <section className="space-y-6">
      <AddNewHeader name="Dashboard" />

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/80 p-6 text-slate-900 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Overview
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, admin
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                Track the latest platform activity, content updates, and member
                growth in one place.
              </p>
            </div>
          </div>

          <div className="grid min-w-[220px] gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Total records
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {formatCount(totalRecords)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {updatedStats.map((stat, index) => (
          <Card
            key={`${stat.title}-${index}`}
            className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white/55 bg-gradient-to-br ${stat.cardClass} p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="p-5">
              <div className="mb-5 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.accent}`}
                >
                  {stat.icon}
                </div>
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Live
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
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
