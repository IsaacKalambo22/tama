import { LayoutGrid, User } from "lucide-react"
import { SidebarProps } from "../sidebar"

export const FARMER_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/farmer",
    icon: LayoutGrid,
  },
  {
    label: "My Profile",
    href: "/farmer/profile",
    icon: User,
  },
]
