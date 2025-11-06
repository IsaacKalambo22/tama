"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { navItems } from "../../constants/nav-items"
import SearchDialog from "../../search/search-dialogue"

const Desktop = () => {
  const user = false
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 sm:px-2 flex justify-between items-center h-full">
        {/* LEFT SIDE */}
        <div className="items-center h-full gap-2">
          <div className="flex items-center h-full gap-2">
            <Link
              href="/"
              // className='flex items-center gap-2'
            >
              <div className="w-full h-full justify-center items-center">
                <Image
                  src="/assets/images/logo.png"
                  width={43}
                  height={43}
                  alt="logo"
                  className="object-contain"
                />
              </div>
            </Link>
            <Link
              href="/"
              className=" bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent text-[1rem] leading-snug capitalize"
            >
              TAMA Farmers Trust
            </Link>
          </div>
        </div>
        {/* MIDDLE */}
        <div className="items-center justify-center ">
          <NavigationMenu>
            <NavigationMenuList className="space-x-0">
              {navItems.map((section) => (
                <NavigationMenuItem
                  key={section.title}
                  className={cn(
                    "",
                    pathname.startsWith(section.href) && "text-green-600"
                  )}
                >
                  {section.submenu && section.subMenuItems ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          "text-gray-600 hover:text-green-600",
                          pathname.startsWith(section.href) && "text-green-600"
                        )}
                      >
                        {section.title}
                      </NavigationMenuTrigger>

                      <NavigationMenuContent>
                        <ul className="grid w-full grid-cols-1 gap-3 px-4 md:w-[600] lg:w-[600px]">
                          <div className="flex flex-col md:flex-row gap-4 ">
                            <div className="flex flex-col flex-1 my-4">
                              {section.subMenuItems
                                .slice(
                                  0,
                                  Math.ceil(section.subMenuItems.length / 2)
                                )
                                .map((item) => (
                                  <ListItem
                                    key={item.title}
                                    title={item.title}
                                    href={item.href}
                                    icon={item.icon}
                                  >
                                    {item.description}
                                  </ListItem>
                                ))}
                            </div>
                            <Separator
                              orientation="vertical"
                              className="h-full"
                            />
                            {/* Vertical separator */}
                            <div className="flex flex-col flex-1 my-4">
                              {section.subMenuItems
                                .slice(
                                  Math.ceil(section.subMenuItems.length / 2)
                                )
                                .map((item) => (
                                  <ListItem
                                    key={item.title}
                                    title={item.title}
                                    href={item.href}
                                    icon={item.icon}
                                  >
                                    {item.description}
                                  </ListItem>
                                ))}
                            </div>
                          </div>
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <>
                      <NavigationMenuItem>
                        {section.external ? (
                          <a
                            href={section.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "text-gray-600 hover:text-green-600 group inline-flex h-9 w-max items-center justify-center  px-3 py-2 text-sm font-medium transition-colors   focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
                              pathname === section.href && "text-green-600"
                            )}
                          >
                            {section.title}
                          </a>
                        ) : (
                          <Link href={section.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                // navigationMenuTriggerStyle()
                                "text-gray-600 hover:text-green-600 group inline-flex h-9 w-max items-center justify-center  px-3 py-2 text-sm font-medium transition-colors   focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
                                pathname === section.href && "text-green-600"
                              )}
                              // className={navigationMenuTriggerStyle()}
                            >
                              {section.title}
                            </NavigationMenuLink>
                          </Link>
                        )}
                      </NavigationMenuItem>
                      {/* <Link
                        href={section.href}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={cn(
                            'text-gray-600 hover:text-green-600 mr-5',
                            pathname ===
                              section.href &&
                              'text-green-600'
                          )}
                        >
                          {section.title}
                        </NavigationMenuLink>
                      </Link> */}
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT SIDE */}
        <div className=" text-right ">
          <div className="flex gap-4 justify-end items-center">
            {/* <Button
              className='w-8 h-7'
              variant='ghost'
              size='icon'
              onClick={() => setIsModalOpen(true)}
            >
              <Search className='h-4 w-4' />
            </Button> */}
            {user ? (
              <Button
                type="button"
                // onClick={() => signOut()}
                className="h-7 font-normal"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button className="h-7 font-normal">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH DIALOG */}
      {isSearchOpen && (
        <SearchDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

export default Desktop

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              " select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-gray-700 focus:bg-accent focus:text-gray-700 text-gray-700 flex items-center gap-4",
              className
            )}
            {...props}
          >
            <div className="flex-shrink-0">
              {/* Render icon inside a button */}
              {icon && (
                <Button
                  variant="outline"
                  size="icon"
                  className="p-1 hover:bg-white"
                >
                  {icon}
                </Button>
              )}
            </div>
            <div>
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"
