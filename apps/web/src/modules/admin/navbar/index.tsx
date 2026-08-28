"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ROLE_LABELS } from "@/modules/admin/constants"
import { useSidebarStore } from "@/providers/sidebar-state"
import { useSession } from "next-auth/react"
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import MessageBell from "@/modules/admin/message-bell"
import SystemNotificationBell from "@/modules/admin/system-notification-bell"
import SupportBell from "@/modules/common/support/support-bell"
import Link from "next/link"
import { useEffect } from "react"

const Navbar = () => {
  const isSidebarCollapsed = useSidebarStore(
    (state) => state.isSidebarCollapsed
  )
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
  const { data: session } = useSession()

  useEffect(() => {
    ;(async () => {})()
  }, [session])

  const roleLabel = ROLE_LABELS[session?.role as string] || session?.role
  const scopeInfo = (session as any)?.councilName
    ? (session as any)?.districtName
      ? `${(session as any).districtName}, ${(session as any).councilName}`
      : (session as any).councilName
    : null

  return (
    <Card className="flex w-full items-center justify-between rounded-none bg-white px-4 py-3 shadow-none dark:bg-black">
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? (
          <Button size="icon" variant="ghost" onClick={toggleSidebar}>
            <AiOutlineMenuFold className="h-5 w-5 dark:text-white" />
          </Button>
        ) : (
          <Button size="icon" variant="ghost" onClick={toggleSidebar}>
            <AiOutlineMenuUnfold className="h-5 w-5 dark:text-white" />
          </Button>
        )}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            {roleLabel}
          </span>
          {scopeInfo && (
            <span className="text-xs text-gray-400">| {scopeInfo}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mr-5">
        <SupportBell />
        <MessageBell />
        <SystemNotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-10 " variant="outline">
              {session?.user?.image && (
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={session?.user?.image || "/profile.png"}
                    alt={`${session?.name}'s profile`}
                  />
                </Avatar>
              )}
              {session?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

export default Navbar
