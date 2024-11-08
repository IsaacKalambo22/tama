// src/layouts/MainLayout.tsx
'use client';

import { Toaster } from '@/components/ui/toaster';
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
      <main className='app'>
        {!isAuthPage && !isAdminPage && (
          <Navbar />
        )}
        <div className='max-w-7xl mx-auto max-sm:px-6 grow h-screen'>
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
