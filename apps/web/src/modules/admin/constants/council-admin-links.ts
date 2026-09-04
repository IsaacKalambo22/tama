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

export const COUNCIL_ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/council-admin",
    icon: LayoutGrid,
  },
  {
    label: "My Profile",
    href: "/council-admin/profile",
    icon: User,
  },
  {
    label: "Farmers",
    href: "/council-admin/farmers",
    icon: UsersIcon,
  },
  {
    label: "Tobacco Business",
    icon: ShoppingBag,
    submenu: [
      {
        label: "Shops",
        href: "/council-admin/tobacco-business/shops",
      },
      {
        label: "Event Calendar",
        href: "/council-admin/tobacco-business/events",
      },
    ],
  },
  {
    label: "Home Display",
    icon: Images,
    submenu: [
      {
        label: "Home Carousel",
        href: "/council-admin/home-display/carousel",
      },
      {
        label: "Home Image Text",
        href: "/council-admin/home-display/home-image-text",
      },
      {
        label: "Our Team",
        href: "/council-admin/home-display/team",
      },
      {
        label: "Status",
        href: "/council-admin/home-display/status",
      },
    ],
  },
  {
    label: "News & Updates",
    icon: NewspaperIcon,
    submenu: [
      {
        label: "News",
        href: "/council-admin/news-updates/news",
      },
      {
        label: "Vacancies",
        href: "/council-admin/news-updates/vacancies",
      },
    ],
  },
  {
    label: "Services",
    href: "/council-admin/services",
    icon: Wrench,
  },
  {
    label: "Blogs",
    href: "/council-admin/blogs",
    icon: Book,
  },
  {
    label: "Messaging",
    icon: MessageCircle,
    submenu: [
      {
        label: "Inbox",
        href: "/council-admin/messages/inbox",
      },
      {
        label: "Compose",
        href: "/council-admin/messages/compose",
      },
      {
        label: "Sent & Scheduled",
        href: "/council-admin/messages/batches",
      },
      {
        label: "Recipient Groups",
        href: "/council-admin/messages/groups",
      },
    ],
  },
  {
    label: "Notifications",
    href: "/council-admin/notifications",
    icon: Bell,
  },
  {
    label: "Support Requests",
    href: "/council-admin/support",
    icon: LifeBuoy,
  },
]
