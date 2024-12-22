'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/providers/sidebar-state';
import {
  LogOut,
  LucideIcon,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarLink } from './sidebar-link';

export interface SidebarProps {
  links: {
    href: string;
    icon: LucideIcon;
    label: string;
    submenu?: { label: string; href: string }[];
  }[];
}

const Sidebar = ({ links }: SidebarProps) => {
  const { isSidebarCollapsed, toggleSidebar } =
    useSidebarStore((state) => state);

  return (
    <Card
      className={cn(
        'fixed z-40 flex h-full w-72 flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 md:w-[17rem]',
        {
          'w-0 md:w-16': isSidebarCollapsed,
        }
      )}
    >
      <div className='flex h-[100%] w-full flex-col justify-start'>
        {/* TOP LOGO */}
        <div
          className={cn(
            'py-2 flex items-center justify-between gap-4 pl-5 pr-4',
            { 'pl-4': isSidebarCollapsed }
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 ',
              { 'pl-2': !isSidebarCollapsed }
            )}
          >
            <Link
              href='/admin'
              className='flex items-center gap-2'
            >
              <div
                className={cn(
                  'w-full h-full  justify-center items-center',
                  { 'py-2': isSidebarCollapsed }
                )}
              >
                <Image
                  src='/assets/images/logo.png'
                  width={40}
                  height={40}
                  alt='logo'
                  layout='fixed'
                  className='object-contain'
                />
              </div>
            </Link>

            <Link
              href='/'
              className={cn(
                'bg-gradient-to-r from-green-600 to-amber-500 bg-clip-text text-transparent text-[1rem] leading-snug capitalize max-sm:text-[0.9rem]',
                { hidden: isSidebarCollapsed }
              )}
            >
              TAMA Farmers Trust
            </Link>
          </div>

          <Button
            className='sm:hidden'
            size='icon'
            variant='ghost'
            onClick={toggleSidebar}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
        <Separator />
        {/* NAVBAR LINKS */}
        <nav className='z-10 w-full'>
          {links.map((item, index) => (
            <SidebarLink
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              submenu={item.submenu}
              isCollapsed={isSidebarCollapsed}
            />
          ))}
        </nav>
      </div>
      {/* FOOTER */}
      <div className='w-full flex flex-col p-2 mb-10'>
        {/* First button visible only when the sidebar is NOT collapsed */}
        <Button
          onClick={() =>
            signOut({ callbackUrl: '/' })
          }
          className={cn('h-9', {
            hidden: isSidebarCollapsed,
          })}
        >
          Sign Out
        </Button>

        {/* Second button (icon) visible only when the sidebar is collapsed */}
        <Button
          onClick={() =>
            signOut({ callbackUrl: '/' })
          }
          size='icon'
          variant='outline'
          className={cn({
            hidden: !isSidebarCollapsed,
          })}
        >
          <LogOut className='h-4 w-4' />
        </Button>
      </div>
    </Card>
  );
};

export default Sidebar;
