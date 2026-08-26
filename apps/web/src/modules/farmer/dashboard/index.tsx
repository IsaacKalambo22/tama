"use client"

import { Card } from "@/components/ui/card"
import { useSession } from "next-auth/react"

export default function FarmerDashboard() {
  const { data: session } = useSession()

  const councilName = (session as any)?.councilName || "Not assigned"
  const districtName = (session as any)?.districtName || "Not assigned"

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-xl shadow-none hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            My Profile
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Name:</span> {session?.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {session?.user?.email}
            </p>
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-none hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            My Location
          </h3>
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
      </div>

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
