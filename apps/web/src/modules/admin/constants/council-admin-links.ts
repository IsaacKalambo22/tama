import { LayoutGrid, UsersIcon } from "lucide-react"
import { SidebarProps } from "../sidebar"

export const COUNCIL_ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/council-admin",
    icon: LayoutGrid,
  },
  {
    label: "Farmers",
    href: "/council-admin/farmers",
    icon: UsersIcon,
  },
]
