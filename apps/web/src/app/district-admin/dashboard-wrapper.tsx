"use client"

import { DISTRICT_ADMIN_LINKS } from "@/modules/admin/constants/district-admin-links"
import Navbar from "@/modules/admin/navbar"
import Sidebar from "@/modules/admin/sidebar"
import { useSidebarStore } from "@/providers/sidebar-state"
import React from "react"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useSidebarStore(
    (state) => state.isSidebarCollapsed
  )

  return (
    <div className="flex w-full text-gray-900">
      <Sidebar links={DISTRICT_ADMIN_LINKS} />
      <main
        className={`flex flex-col w-full min-h-screen dark:bg-dark-bg transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-16" : "md:pl-[17rem]"
        }`}
      >
        <Navbar />
        <div className="flex-grow py-4 px-6">{children}</div>
      </main>
    </div>
  )
}

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
