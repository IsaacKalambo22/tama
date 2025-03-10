import Link from 'next/link';
import { ReactNode } from 'react';

const Layout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <main className='relative flex flex-col-reverse  sm:flex-row'>
      <section className='my-auto flex h-full min-h-screen flex-1 items-center bg-pattern bg-cover bg-top py-10 relative'>
        <div className='mx-auto flex w-full max-w-[405px] flex-col p-10'>
          <div className='flex items-center justify-center flex-row '>
            <Link href='/'>
              <h1 className='text-xl font-semibold text-primary'>
                Pacific Diagnostics Limited
              </h1>
            </Link>
          </div>

          <>{children}</>
        </div>
      </section>
    </main>
  );
};

export default Layout;
