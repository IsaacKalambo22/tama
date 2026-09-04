"use client"

import { Button } from "@/components/ui/button"
import { fetchSupportThreads } from "@/lib/support"
import { LifeBuoy } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

// Polling matches the message bell — no realtime infra exists yet.
const POLL_INTERVAL_MS = 60_000

const SUPPORT_PATH_BY_ROLE: Record<string, string> = {
  FARMER: "/farmer/support",
  SUPER_ADMIN: "/admin/support",
  COUNCIL_ADMIN: "/council-admin/support",
  DISTRICT_ADMIN: "/district-admin/support",
}

const SupportBell = () => {
  const { data: session } = useSession()
  const token = session?.accessToken
  const role = session?.role
  const href = role ? SUPPORT_PATH_BY_ROLE[role] : undefined

  const [unread, setUnread] = useState(0)

  const refresh = useCallback(async () => {
    if (!token || !href) return
    try {
      const threads = await fetchSupportThreads(token)
      setUnread(threads.reduce((sum, t) => sum + t.unreadCount, 0))
    } catch (error) {
      console.error("Failed to fetch support unread count:", error)
    }
  }, [token, href])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refresh])

  if (!href) return null

  return (
    <Button size="icon" variant="ghost" className="relative" asChild>
      <Link href={href} aria-label="Support">
        <LifeBuoy className="h-5 w-5 dark:text-white" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </Link>
    </Button>
  )
}

export default SupportBell
