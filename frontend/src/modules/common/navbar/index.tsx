'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSidebarStore } from '@/providers/sidebar-state'; // Import Zustand store
import { Search, Settings } from 'lucide-react';
import Link from 'next/link';
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from 'react-icons/ai';

const Navbar = () => {
  // Access isSidebarCollapsed state from Zustand store
  const isSidebarCollapsed = useSidebarStore(
    (state) => state.isSidebarCollapsed
  );
  const toggleSidebar = useSidebarStore(
    (state) => state.toggleSidebar
  ); // Use toggle function from Zustand

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
        <div className='relative flex h-min w-[200px]'>
          <Search className='absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white' />
          <Input
            className='w-full border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white'
            type='search'
            placeholder='Search...'
          />
        </div>
      </div>

      {/* Icons */}
      <div className='mr-6 flex items-center gap-2'>
        <Link
          href='/settings'
          className='h-min w-min rounded p-2 hover:bg-gray-100'
        >
          <Settings className='h-6 w-6 cursor-pointer dark:text-white' />
        </Link>
      </div>
    </Card>
  );
};

export default Navbar;
