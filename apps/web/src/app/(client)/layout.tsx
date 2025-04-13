import Footer from '@/modules/client/footer';
import { Navbar } from '@/modules/client/navbar';
import { ReactNode } from 'react';

const Layout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <main className='grid grid-rows-[auto_1fr_auto] h-full min-h-screen w-full  bg-top '>
      <Navbar />

      <div className='max-w-7xl mx-auto px-6 sm:px-2 w-full h-full z-30'>
        {children}
      </div>

      <Footer />
    </main>
  );
};

export default Layout;
