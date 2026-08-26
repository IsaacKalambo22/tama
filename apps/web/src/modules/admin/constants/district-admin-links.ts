import {
  BookOpen,
  LayoutGrid,
  NewspaperIcon,
  ShoppingBag,
  UsersIcon,
} from "lucide-react"
import { SidebarProps } from "../sidebar"

export const DISTRICT_ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/district-admin",
    icon: LayoutGrid,
  },
  {
    label: "Resources",
    icon: BookOpen,
    submenu: [
      {
        label: "Council List",
        href: "/district-admin/council-list",
      },
    ],
  },
  {
    label: "Tobacco Business",
    icon: ShoppingBag,
    submenu: [
      {
        label: "Events",
        href: "/district-admin/events",
      },
    ],
  },
  {
    label: "News & Updates",
    icon: NewspaperIcon,
    submenu: [
      {
        label: "News",
        href: "/district-admin/news",
      },
    ],
  },
  {
    label: "Farmers",
    href: "/district-admin/farmers",
    icon: UsersIcon,
  },
]
