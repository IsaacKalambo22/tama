'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { navItems } from '../../constants/nav-items';
import NavIconButtons from '../nav-con-buttons';

const Desktop = () => {
  const user = false;
  return (
    <>
      <div className='max-w-7xl mx-auto px-6 sm:px-16 flex justify-between items-center h-full'>
        {/* LEFT SIDE */}
        <div className='flex-1 items-center gap-2'>
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <div className='w-full h-full  justify-center items-center'>
              <Image
                src='/assets/images/logo.png'
                width={40} // Double the dimensions to improve quality on higher-DPI screens
                height={40}
                alt='logo'
                layout='fixed' // Ensures Next.js optimizes the image size and quality
                className='object-contain'
              />
            </div>
          </Link>
        </div>

        {/* MIDDLE */}
        <div className='items-center justify-center'>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((section) => (
                <NavigationMenuItem
                  key={section.title}
                >
                  {section.submenu &&
                  section.subMenuItems ? (
                    <>
                      <NavigationMenuTrigger className='text-gray-600 hover:text-gray-800'>
                        {section.title}
                      </NavigationMenuTrigger>

                      <NavigationMenuContent>
                        <ul className='grid w-full grid-cols-1 gap-3 px-4 md:w-[600] lg:w-[600px]'>
                          <div className='flex flex-col md:flex-row gap-4 '>
                            <div className='flex flex-col flex-1 my-4'>
                              {section.subMenuItems
                                .slice(
                                  0,
                                  Math.ceil(
                                    section
                                      .subMenuItems
                                      .length / 2
                                  )
                                )
                                .map((item) => (
                                  <ListItem
                                    key={
                                      item.title
                                    }
                                    title={
                                      item.title
                                    }
                                    href={
                                      item.href
                                    }
                                    icon={
                                      item.icon
                                    }
                                  >
                                    {
                                      item.description
                                    }
                                  </ListItem>
                                ))}
                            </div>
                            <Separator
                              orientation='vertical'
                              className='h-full'
                            />
                            {/* Vertical separator */}
                            <div className='flex flex-col flex-1 my-4'>
                              {section.subMenuItems
                                .slice(
                                  Math.ceil(
                                    section
                                      .subMenuItems
                                      .length / 2
                                  )
                                )
                                .map((item) => (
                                  <ListItem
                                    key={
                                      item.title
                                    }
                                    title={
                                      item.title
                                    }
                                    href={
                                      item.href
                                    }
                                    icon={
                                      item.icon
                                    }
                                  >
                                    {
                                      item.description
                                    }
                                  </ListItem>
                                ))}
                            </div>
                          </div>
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={section.href}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink className='text-gray-600 hover:text-gray-800'>
                        {section.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT SIDE */}
        <div className='flex-1 text-right '>
          <div className='flex gap-2 justify-end items-center'>
            <NavIconButtons />
            {user ? (
              <Button
                type='button'
                // onClick={() => signOut()}
                className='h-7 font-normal'
              >
                Sign Out
              </Button>
            ) : (
              <Link href='/register'>
                <Button className='h-7 font-normal'>
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Desktop;

interface ListItemProps
  extends React.ComponentPropsWithoutRef<'a'> {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  ListItemProps
>(
  (
    {
      className,
      title,
      children,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              ' select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-gray-700 focus:bg-accent focus:text-gray-700 text-gray-700 flex items-center gap-4',
              className
            )}
            {...props}
          >
            <div className='flex-shrink-0'>
              {/* Render icon inside a button */}
              {icon && (
                <Button
                  variant='outline'
                  size='icon'
                  className='p-1 hover:bg-white'
                >
                  {icon}
                </Button>
              )}
            </div>
            <div>
              <div className='text-sm font-medium leading-none'>
                {title}
              </div>
              <p className='line-clamp-1 text-sm leading-snug text-muted-foreground'>
                {children}
              </p>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
