'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/providers/sidebar-state';
import { LucideIcon, X } from 'lucide-react';
import { IconBase } from 'react-icons/lib';
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
        'fixed z-40 flex h-full w-72 flex-col overflow-hidden rounded-none bg-white shadow-md transition-all duration-300 md:w-64',
        { 'w-0 md:w-16': isSidebarCollapsed }
      )}
    >
      <div className='flex h-[100%] w-full flex-col justify-start'>
        {/* TOP LOGO */}
        <div
          className={cn(
            'mt-4 flex items-center justify-between gap-4 pl-5 pr-4',
            { 'pl-4': isSidebarCollapsed }
          )}
        >
          <div className='flex items-center gap-2'>
            <Button
              size='icon'
              variant='ghost'
              className='hover:bg-none'
            >
              <IconBase className='h-6 w-6 text-green-500' />
            </Button>
            <h3
              className={cn(
                'text-lg font-bold text-green-500',
                {
                  hidden: isSidebarCollapsed,
                }
              )}
            >
              MIRE
            </h3>
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
    </Card>
  );
};

export default Sidebar;
