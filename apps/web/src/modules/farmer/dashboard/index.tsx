"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { NewsProps } from "@/lib/api"
import { formatDateTime } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FaBell, FaMapMarkerAlt, FaNewspaper, FaUser } from "react-icons/fa"

export default function FarmerDashboard() {
  const { data: session } = useSession()
  const [news, setNews] = useState<NewsProps[]>([])
  const [loadingNews, setLoadingNews] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
        const res = await fetch(`${baseUrl}/news`)
        if (res.ok) {
          const data = await res.json()
          setNews((data.data || []).slice(0, 5))
        }
      } catch (error) {
        console.error("Failed to fetch news:", error)
      } finally {
        setLoadingNews(false)
      }
    }
    fetchNews()
  }, [])

  const councilName = (session as any)?.councilName || "Not assigned"
  const districtName = (session as any)?.districtName || "Not assigned"
  const role = (session as any)?.role

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back,{" "}
          <span className="font-semibold text-green-600">
            {session?.user?.name}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl shadow-none hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <FaUser size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">My Profile</h3>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Name:</span> {session?.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {session?.user?.email}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              <Badge variant="secondary">Farmer</Badge>
            </p>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-none hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <FaMapMarkerAlt size={24} className="text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-800">My Location</h3>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Council:</span>{" "}
              <span className="text-green-600">{councilName}</span>
            </p>
            <p>
              <span className="font-medium">District:</span>{" "}
              <span className="text-amber-600">{districtName}</span>
            </p>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-none hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <FaBell size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Account Status
            </h3>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Role level:</span>{" "}
              {role || "FARMER"}
            </p>
            <p className="text-sm text-muted-foreground">
              Your user type determines what you can view within your area.
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-xl shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <FaNewspaper size={24} className="text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            Latest News & Updates
          </h3>
        </div>
        {loadingNews ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : news.length === 0 ? (
          <p className="text-gray-500">No news updates yet.</p>
        ) : (
          <div className="divide-y">
            {news.map((item) => (
              <div key={item.id} className="py-3">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 rounded-xl shadow-none">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/tobacco-business/council-list"
            className="block p-4 border rounded-lg hover:bg-green-50 transition-colors"
          >
            <h4 className="font-medium text-gray-800">Council List</h4>
            <p className="text-sm text-gray-500">View your council members</p>
          </a>
          <a
            href="/tobacco-business/event-calendar"
            className="block p-4 border rounded-lg hover:bg-green-50 transition-colors"
          >
            <h4 className="font-medium text-gray-800">Events</h4>
            <p className="text-sm text-gray-500">View upcoming events</p>
          </a>
          <a
            href="/news-updates/current-news-updates"
            className="block p-4 border rounded-lg hover:bg-green-50 transition-colors"
          >
            <h4 className="font-medium text-gray-800">News</h4>
            <p className="text-sm text-gray-500">Latest news and updates</p>
          </a>
          <a
            href="/contact"
            className="block p-4 border rounded-lg hover:bg-green-50 transition-colors"
          >
            <h4 className="font-medium text-gray-800">Contact Us</h4>
            <p className="text-sm text-gray-500">Get in touch with TAMA</p>
          </a>
        </div>
      </Card>
    </section>
  )
}
