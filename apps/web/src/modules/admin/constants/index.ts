import {
  Bell,
  Book,
  BookOpen,
  Images,
  LayoutGrid,
  MessageCircle,
  NewspaperIcon,
  ShoppingBag,
  UsersIcon,
  Wrench,
} from "lucide-react" // Adjust import path for icons if needed
import { SidebarProps } from "../sidebar"

export const ADMIN_LINKS: SidebarProps[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "Resources",
    icon: BookOpen,
    submenu: [
      {
        label: " Publications",
        href: "/admin/resources/reports-publications",
      },
      {
        label: "Current Forms",
        href: "/admin/resources/forms-documents",
      },
      {
        label: "Council List",
        href: "/admin/resources/council-list",
      },
    ],
  },
  {
    label: "Tobacco Business",
    icon: ShoppingBag,
    submenu: [
      {
        label: "Shops",
        href: "/admin/tobacco-business/shops",
      },
      {
        label: "Event Calendar",
        href: "/admin/tobacco-business/events",
      },
    ],
  },
  {
    label: "Home Display",
    icon: Images,
    submenu: [
      {
        label: "Home Carousel",
        href: "/admin/home-display/carousel",
      },
      {
        label: "Home Image Text",
        href: "/admin/home-display/home-image-text",
      },
      {
        label: "Our Team",
        href: "/admin/home-display/team",
      },
      {
        label: "Status",
        href: "/admin/home-display/status",
      },
    ],
  },
  {
    label: "News & Updates",
    icon: NewspaperIcon,
    submenu: [
      {
        label: "News",
        href: "/admin/news-updates/news",
      },
      {
        label: "Vacancies",
        href: "/admin/news-updates/vacancies",
      },
    ],
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    label: "Blogs",
    href: "https://tamafarmertrust.blogspot.com/",
    icon: Book,
  },
  {
    label: "Users",
    icon: UsersIcon,
    submenu: [
      {
        label: "All Users",
        href: "/admin/users",
      },
    ],
  },
  {
    label: "Messaging", // New "Messaging" section
    href: "/admin/messages", // Path for the messaging section
    icon: MessageCircle, // Icon for messaging
  },
  {
    label: "Notifications",
    icon: Bell,
    submenu: [
      {
        label: "Inbox",
        href: "/admin/notifications",
      },
      {
        label: "Compose",
        href: "/admin/notifications/compose",
      },
      {
        label: "Sent & Scheduled",
        href: "/admin/notifications/batches",
      },
      {
        label: "Recipient Groups",
        href: "/admin/notifications/groups",
      },
    ],
  },
]

export const actionsDropdownItems = [
  {
    label: "Edit",
    icon: "/assets/icons/edit.svg",
    value: "edit",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },

  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
]

export const adminActionsDropdownItems = [
  {
    label: "Edit",
    icon: "/assets/icons/edit.svg",
    value: "edit",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
]
export const clientActionsDropdownItems = [
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },

  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
]

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
]

export const avatarPlaceholderUrl =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  COUNCIL_ADMIN: "Council Admin",
  DISTRICT_ADMIN: "District Admin",
  FARMER: "Farmer",
}
