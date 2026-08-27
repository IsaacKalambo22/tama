"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FaListAlt, FaNewspaper, FaUsers } from "react-icons/fa"

interface DashboardStats {
  title: string
  count: number
  icon: React.ReactNode
}

export default function DistrictAdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats[]>([])
  const [loading, setLoading] = useState(true)
  const [recentFarmers, setRecentFarmers] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT
        const token = (session as any)?.accessToken

        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        }

        const [councilListsRes, usersRes, newsRes] = await Promise.all([
          fetch(`${baseUrl}/council-lists/scoped`, { headers }),
          fetch(`${baseUrl}/users`, { headers }),
          fetch(`${baseUrl}/news`, { headers }),
        ])

        const councilLists = councilListsRes.ok
          ? (await councilListsRes.json()).data || []
          : []
        const users = usersRes.ok ? (await usersRes.json()).data || [] : []
        const news = newsRes.ok ? (await newsRes.json()).data || [] : []

        const farmers = users.filter((u: any) => u.role === "FARMER")

        setRecentFarmers(farmers.slice(0, 5))
        setStats([
          {
            title: "Farmers",
            count: farmers.length,
            icon: <FaUsers size={30} className="text-purple-500" />,
          },
          {
            title: "Council List Entries",
            count: councilLists.length,
            icon: <FaListAlt size={30} className="text-indigo-500" />,
          },
          {
            title: "News",
            count: news.length,
            icon: <FaNewspaper size={30} className="text-red-500" />,
          },
        ])
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  const districtName = (session as any)?.districtName || "Your District"
  const councilName = (session as any)?.councilName || "Your Council"

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          District Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Managing:{" "}
          <span className="font-semibold text-green-600">{districtName}</span>
          <span className="text-gray-400 mx-2">in</span>
          <span className="font-semibold text-amber-600">{councilName}</span>
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
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
                    {stat.count}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {recentFarmers.length > 0 && (
        <Card className="shadow-none rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Farmers in {districtName}
          </h3>
          <div className="divide-y">
            {recentFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="font-medium">{farmer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {farmer.email}
                  </p>
                </div>
                <Badge variant="secondary">
                  {farmer.districtName || "No district"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </section>
  )
}
