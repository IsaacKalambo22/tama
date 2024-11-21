'use client';

import { ADMIN_LINKS } from '@/modules/admin/constants';
import Navbar from '@/modules/common/navbar';
import Sidebar from '@/modules/common/sidebar';
import { useSidebarStore } from '@/providers/sidebar-state'; // Import Zustand store
import React from 'react';

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Use Zustand to manage the sidebar collapse state
  const isSidebarCollapsed = useSidebarStore(
    (state) => state.isSidebarCollapsed
  );

  return (
    <div className='flex min-h-screen w-full bg-gray-50 text-gray-900 overflow-hidden'>
      {/* Sidebar */}
      <Sidebar links={ADMIN_LINKS} />

      {/* Main content area */}
      <main
        className={`flex flex-col w-full h-screen overflow-auto bg-gray-50 dark:bg-dark-bg transition-all duration-300 ${
          isSidebarCollapsed
            ? 'md:pl-16' // Reduced padding when collapsed
            : 'md:pl-64' // More padding when expanded
        }`}
      >
        <Navbar />
        <div className='flex-grow p-4'>
          {children}
        </div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
};

export default DashboardWrapper;
