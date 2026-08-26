import {
  BookOpen,
  Images,
  LayoutGrid,
  NewspaperIcon,
  ShoppingBag,
  UsersIcon,
  Wrench,
} from "lucide-react"
import { SidebarProps } from "../sidebar"

export const COUNCIL_ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/council-admin",
    icon: LayoutGrid,
  },
  {
    label: "Resources",
    icon: BookOpen,
    submenu: [
      {
        label: "Council List",
        href: "/council-admin/council-list",
      },
    ],
  },
  {
    label: "Tobacco Business",
    icon: ShoppingBag,
    submenu: [
      {
        label: "Events",
        href: "/council-admin/events",
      },
    ],
  },
  {
    label: "News & Updates",
    icon: NewspaperIcon,
    submenu: [
      {
        label: "News",
        href: "/council-admin/news",
      },
    ],
  },
  {
    label: "Farmers",
    href: "/council-admin/farmers",
    icon: UsersIcon,
  },
  {
    label: "Services",
    href: "/council-admin/services",
    icon: Wrench,
  },
  {
    label: "Home Display",
    icon: Images,
    submenu: [
      {
        label: "Team",
        href: "/council-admin/team",
      },
    ],
  },
]
