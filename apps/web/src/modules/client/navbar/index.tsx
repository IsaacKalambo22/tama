import Desktop from './desktop';
import Mobile from './mobile';

export const Navbar = () => {
  return (
    <div className='min-w-full bg-[#FFFFFFF2] border h-[57px] sticky top-0 z-50'>
      <div className='hidden lg:block h-full'>
        <Desktop />
      </div>

      <div className='lg:hidden'>
        <Mobile />
      </div>
    </div>
  );
};
