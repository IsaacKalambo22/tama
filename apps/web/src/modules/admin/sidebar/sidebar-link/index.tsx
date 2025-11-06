"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export interface SidebarLinkProps {
  href?: string
  icon: LucideIcon
  label: string
  isCollapsed?: boolean
  submenu?: { label: string; href: string }[]
}

export const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  submenu,
}: SidebarLinkProps) => {
  const pathname = usePathname()
  const isActive =
    pathname === href ||
    (submenu && submenu.some((subItem) => pathname === subItem.href))
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const toggleSubmenu = () => setIsSubmenuOpen((prev) => !prev)

  // Check if href is external (starts with http:// or https://)
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://")

  return (
    <div className="relative">
      <div onClick={submenu ? toggleSubmenu : undefined}>
        {href ? (
          isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              <div
                className={cn(
                  "my-1 flex cursor-pointer items-center justify-start gap-3 py-3 transition-colors hover:bg-green-100 hover:text-green-500",
                  {
                    "bg-green-100 text-green-500": isActive,
                    "justify-center py-4": isCollapsed,
                    "px-8": !isCollapsed,
                  }
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-[5px] bg-green-600" />
                )}
                <Icon
                  className={cn("h-5 w-5 text-gray-800", {
                    "text-green-500": isActive,
                    block: isCollapsed,
                  })}
                />
                <span
                  className={cn("font-sans text-sm font-normal text-gray-800", {
                    hidden: isCollapsed,
                    "text-green-500": isActive,
                  })}
                >
                  {label}
                </span>
                {submenu && !isCollapsed && (
                  <span className="ml-auto text-xs">
                    {isSubmenuOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </a>
          ) : (
            <Link href={href}>
              <div
                className={cn(
                  "my-1 flex cursor-pointer items-center justify-start gap-3 py-3 transition-colors hover:bg-green-100 hover:text-green-500",
                  {
                    "bg-green-100 text-green-500": isActive,
                    "justify-center py-4": isCollapsed,
                    "px-8": !isCollapsed,
                  }
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-[5px] bg-green-600" />
                )}
                <Icon
                  className={cn("h-5 w-5 text-gray-800", {
                    "text-green-500": isActive,
                    block: isCollapsed,
                  })}
                />
                <span
                  className={cn("font-sans text-sm font-normal text-gray-800", {
                    hidden: isCollapsed,
                    "text-green-500": isActive,
                  })}
                >
                  {label}
                </span>
                {submenu && !isCollapsed && (
                  <span className="ml-auto text-xs">
                    {isSubmenuOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </Link>
          )
        ) : (
          <div
            className={cn(
              "my-1 flex cursor-pointer items-center justify-start gap-3 py-3 transition-colors hover:bg-green-100 hover:text-green-500",
              {
                "text-green-500": isActive,
                "justify-center py-4": isCollapsed,
                "px-8": !isCollapsed,
              }
            )}
          >
            <Icon
              className={cn("h-5 w-5 text-gray-800", {
                "text-green-500": isActive,
                block: isCollapsed,
              })}
            />
            <span
              className={cn("font-sans text-sm font-normal text-gray-800", {
                hidden: isCollapsed,
                "text-green-500": isActive,
              })}
            >
              {label}
            </span>
            {submenu && !isCollapsed && (
              <span className="ml-auto text-xs">
                {isSubmenuOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Render submenu if present and open */}
      {submenu && isSubmenuOpen && !isCollapsed && (
        <div>
          {submenu.map((subItem) => {
            const isSubItemActive = pathname === subItem.href
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  "relative flex cursor-pointer items-center justify-start py-3 pl-16 transition-colors hover:bg-green-100 hover:text-green-500",
                  {
                    "bg-green-100 text-green-500": isSubItemActive,
                  }
                )}
              >
                {isSubItemActive && (
                  <div className="absolute left-0 top-0 h-full w-[5px] bg-green-600" />
                )}
                <span className="text-sm text-gray-700">{subItem.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
