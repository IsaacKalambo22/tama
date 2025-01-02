'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSidebarStore } from '@/providers/sidebar-state'; // Import Zustand store
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from 'react-icons/ai';

import {
  Avatar,
  AvatarImage,
} from '@/components/ui/avatar';
import Link from 'next/link';
import { useEffect } from 'react';

const Navbar = () => {
  // Access isSidebarCollapsed state from Zustand store
  const isSidebarCollapsed = useSidebarStore(
    (state) => state.isSidebarCollapsed
  );
  const toggleSidebar = useSidebarStore(
    (state) => state.toggleSidebar
  );
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {})();
  }, [session]);

  return (
    <Card className='flex w-full items-center justify-between rounded-none bg-white px-4 py-3 shadow-none dark:bg-black'>
      {/* Search Bar */}
      <div className='flex items-center gap-8'>
        {!isSidebarCollapsed ? (
          <Button
            size='icon'
            variant='ghost'
            onClick={toggleSidebar} // Use the Zustand toggleSidebar function
          >
            <AiOutlineMenuFold className='h-5 w-5 dark:text-white' />
          </Button>
        ) : (
          <Button
            size='icon'
            variant='ghost'
            onClick={toggleSidebar} // Use the Zustand toggleSidebar function
          >
            <AiOutlineMenuUnfold className='h-5 w-5 dark:text-white' />
          </Button>
        )}
        <div className='relative hidden sm:flex h-min w-[200px]'>
          <Search className='absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white' />
          <Input
            className='w-full border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white'
            type='search'
            placeholder='Search...'
          />
        </div>
      </div>

      <div className='mr-5'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='h-10 '
              variant='outline'
            >
              {session?.user?.image && (
                <Avatar className='w-8 h-8'>
                  <AvatarImage
                    src={
                      session?.user?.image ||
                      '/profile.png'
                    }
                    alt={`${session?.name}'s profile`}
                  />
                </Avatar>
              )}
              {session?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40'>
            <DropdownMenuLabel>
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/admin/profile'>
                  Profile
                  <DropdownMenuShortcut>
                    ⇧⌘P
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator /> */}

            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>
                ⇧⌘Q
              </DropdownMenuShortcut>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default Navbar;
