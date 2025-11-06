import { Icon } from "@iconify/react"
import { JSX } from "react"

// Define a type for a navigation item, including optional icon and submenu fields.
export type NavItem = {
  title: string
  href: string
  description?: string
  icon?: JSX.Element
  submenu?: boolean
  subMenuItems?: NavItem[]
  external?: boolean
}

// Create and export the navigation items object.
export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Industry insights and articles from experts.",
    icon: <Icon icon="lucide:pen-tool" width="16" height="16" />,
  },
  {
    title: "About Us",
    href: "/who-we-are",
    description:
      "Learn about our mission, vision, and commitment to tobacco farmers.",
    icon: <Icon icon="lucide:info" width="16" height="16" />,
  },
  {
    title: "Services",
    href: "/services",
    description: "Industry insights and articles from experts.",
    icon: <Icon icon="lucide:pen-tool" width="16" height="16" />,
  },
  {
    title: "Tobacco Business",
    href: "/tobacco-business",
    submenu: true,
    subMenuItems: [
      {
        title: "Council List",
        href: "/tobacco-business/council-list",
        description: "List of council members and representatives.",
        icon: <Icon icon="lucide:list" width="16" height="16" />,
      },
      {
        title: "Calendar of Events",
        href: "/tobacco-business/event-calendar",
        description: "Stay informed about events and opportunities.",
        icon: <Icon icon="lucide:calendar" width="16" height="16" />,
      },
      {
        title: " Publications",
        href: "/tobacco-business/reports-publications",
        description: "Research and publications related to tobacco.",
        icon: <Icon icon="lucide:book-open" width="16" height="16" />,
      },
      {
        title: "Shops",
        href: "/tobacco-business/shops",
        description: "Find our trusted Agre-shops near you.",
        icon: <Icon icon="lucide:shopping-bag" width="16" height="16" />,
      },
      {
        title: "Downloads",
        href: "/tobacco-business/forms",
        description: "Download and access important documents",
        icon: <Icon icon="lucide:file-text" width="16" height="16" />,
      },
    ],
  },
  // {
  //   title: "Resources",
  //   href: "/resources",
  //   submenu: true,
  //   subMenuItems: [
  //     {
  //       title: " Publications",
  //       href: "/resources/reports-publications",
  //       description: "Research and publications related to tobacco.",
  //       icon: <Icon icon="lucide:book-open" width="16" height="16" />,
  //     },
  //     {
  //       title: "Downloads",
  //       href: "/resources/forms",
  //       description: "Download and access important documents",
  //       icon: <Icon icon="lucide:file-text" width="16" height="16" />,
  //     },
  //     {
  //       title: "Council List",
  //       href: "/resources/council-list",
  //       description: "List of council members and representatives.",
  //       icon: <Icon icon="lucide:list" width="16" height="16" />,
  //     },
  //   ],
  // },
  {
    title: "News & Updates",
    href: "/news-updates",
    submenu: true,
    subMenuItems: [
      {
        title: "Current News & Updates",
        href: "/news-updates/current-news-updates",
        description:
          "Various business current-news-updates for the tobacco industry.",
        icon: <Icon icon="lucide:briefcase" width="16" height="16" />,
      },
      {
        title: "Social Media",
        href: "/news-updates/social-media",
        description: "Industry insights and articles from experts.",
        icon: <Icon icon="lucide:pen-tool" width="16" height="16" />,
      },
      {
        title: "Vacancies",
        href: "/news-updates/vacancies",
        description: "Upcoming industry vacancies and important dates.",
        icon: <Icon icon="lucide:calendar" width="16" height="16" />,
      },
    ],
  },
  {
    title: "Blogs",
    href: "https://tamafarmertrust.blogspot.com/",
    description: "Industry insights and articles from experts.",
    icon: <Icon icon="lucide:pen-tool" width="16" height="16" />,
    external: true,
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Industry insights and articles from experts.",
    icon: <Icon icon="lucide:pen-tool" width="16" height="16" />,
  },
]
