import {
  Bell,
  Book,
  Images,
  LayoutGrid,
  LifeBuoy,
  MessageCircle,
  NewspaperIcon,
  ShoppingBag,
  User,
  UsersIcon,
  Wrench,
} from "lucide-react"
import { SidebarProps } from "../sidebar"

export const DISTRICT_ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/district-admin",
    icon: LayoutGrid,
  },
  {
    label: "My Profile",
    href: "/district-admin/profile",
    icon: User,
  },
  {
    label: "Farmers",
    href: "/district-admin/farmers",
    icon: UsersIcon,
  },
  {
    label: "Tobacco Business",
    icon: ShoppingBag,
    submenu: [
      {
        label: "Shops",
        href: "/district-admin/tobacco-business/shops",
      },
      {
        label: "Event Calendar",
        href: "/district-admin/tobacco-business/events",
      },
    ],
  },
  {
    label: "Home Display",
    icon: Images,
    submenu: [
      {
        label: "Home Carousel",
        href: "/district-admin/home-display/carousel",
      },
      {
        label: "Home Image Text",
        href: "/district-admin/home-display/home-image-text",
      },
      {
        label: "Our Team",
        href: "/district-admin/home-display/team",
      },
      {
        label: "Status",
        href: "/district-admin/home-display/status",
      },
    ],
  },
  {
    label: "News & Updates",
    icon: NewspaperIcon,
    submenu: [
      {
        label: "News",
        href: "/district-admin/news-updates/news",
      },
      {
        label: "Vacancies",
        href: "/district-admin/news-updates/vacancies",
      },
    ],
  },
  {
    label: "Services",
    href: "/district-admin/services",
    icon: Wrench,
  },
  {
    label: "Blogs",
    href: "/district-admin/blogs",
    icon: Book,
  },
  {
    label: "Messaging",
    icon: MessageCircle,
    submenu: [
      {
        label: "Inbox",
        href: "/district-admin/messages/inbox",
      },
      {
        label: "Compose",
        href: "/district-admin/messages/compose",
      },
      {
        label: "Sent & Scheduled",
        href: "/district-admin/messages/batches",
      },
      {
        label: "Recipient Groups",
        href: "/district-admin/messages/groups",
      },
    ],
  },
  {
    label: "Notifications",
    href: "/district-admin/notifications",
    icon: Bell,
  },
  {
    label: "Support Requests",
    href: "/district-admin/support",
    icon: LifeBuoy,
  },
]
