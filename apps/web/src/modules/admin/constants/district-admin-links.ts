import { LayoutGrid, LifeBuoy, UsersIcon } from "lucide-react"
import { SidebarProps } from "../sidebar"

export const DISTRICT_ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/district-admin",
    icon: LayoutGrid,
  },
  {
    label: "Farmers",
    href: "/district-admin/farmers",
    icon: UsersIcon,
  },
  {
    label: "Support Requests",
    href: "/district-admin/support",
    icon: LifeBuoy,
  },
]
