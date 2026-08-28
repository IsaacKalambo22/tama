import { LayoutGrid, LifeBuoy, Mail, User } from "lucide-react"
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
  {
    label: "Messages",
    href: "/farmer/messages/inbox",
    icon: Mail,
  },
  {
    label: "Support & Help",
    href: "/farmer/support",
    icon: LifeBuoy,
  },
]
