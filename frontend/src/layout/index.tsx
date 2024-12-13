// src/layouts/MainLayout.tsx
'use client';

import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Footer from '@/modules/client/footer';
import { Navbar } from '@/modules/client/navbar';
import { usePathname } from 'next/navigation';

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  // Define page types
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register';
  const isAdminPage =
    pathname.startsWith('/admin');

  return (
    <>
      <div className='main'>
        <div className='gradient' />
      </div>
      <main className='app'>
        {!isAuthPage && !isAdminPage && (
          <Navbar />
        )}
        <div
          className={cn(' ', {
            'max-w-7xl mx-auto px-4 sm:px-2 w-full':
              !isAdminPage,
          })}
        >
          {children}
        </div>
        <Toaster />
        {!isAuthPage && !isAdminPage && (
          <Footer />
        )}
      </main>
    </>
  );
};

export default MainLayout;
