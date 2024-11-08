// src/layouts/MainLayout.tsx
'use client';

import { Toaster } from '@/components/ui/toaster';
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
        {children}
        <Toaster />
        {/* {!isAuthPage && <Footer />} */}
      </main>
    </>
  );
};

export default MainLayout;
