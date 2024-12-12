'use client';

import { Button } from '@/components/ui/button';

import { Icon } from '@iconify/react/dist/iconify.js';
import {
  motion,
  SVGMotionProps,
  useCycle,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  NavItem,
  navItems,
} from '../../constants/nav-items';
import NavIconButtons from '../nav-con-buttons';

const Mobile: React.FC = () => {
  const useDimensions = (
    ref: React.RefObject<HTMLDivElement>
  ) => {
    const dimensions = useRef({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      if (ref.current) {
        dimensions.current.width =
          ref.current.offsetWidth;
        dimensions.current.height =
          ref.current.offsetHeight;
      }
    }, [ref]);

    return dimensions.current;
  };

  const sidebar = {
    open: (height = 1000) => ({
      clipPath: `circle(${
        height * 2 + 200
      }px at 100% 0)`,
      transition: {
        type: 'spring',
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: 'circle(0px at 100% 0)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  type MenuItemWithSubMenuProps = {
    item: NavItem;
    toggleOpen: () => void;
  };

  const MenuToggle: React.FC<{
    toggle: () => void;
  }> = ({ toggle }) => (
    <Button
      size='icon'
      variant='ghost'
      onClick={toggle}
      className='pointer-events-auto absolute right-4 top-[14px] z-30'
    >
      <svg
        width='23'
        height='23'
        viewBox='0 0 23 23'
      >
        <Path
          variants={{
            closed: { d: 'M 2 2.5 L 20 2.5' },
            open: { d: 'M 3 16.5 L 17 2.5' },
          }}
        />
        <Path
          d='M 2 9.423 L 20 9.423'
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: {
              d: 'M 2 16.346 L 20 16.346',
            },
            open: { d: 'M 3 2.5 L 17 16.346' },
          }}
        />
      </svg>
    </Button>
  );

  const Path: React.FC<
    SVGMotionProps<SVGPathElement>
  > = (props) => (
    <motion.path
      fill='transparent'
      strokeWidth='2'
      stroke='hsl(0, 0%, 18%)'
      strokeLinecap='round'
      {...props}
    />
  );

  const MenuItem: React.FC<{
    className?: string;
    children?: ReactNode;
  }> = ({ className, children }) => (
    <motion.li
      variants={MenuItemVariants}
      className={`${className} py-2 px-2 rounded-lg`}
    >
      {children}
    </motion.li>
  );

  const MenuItemWithSubMenu: React.FC<
    MenuItemWithSubMenuProps
  > = ({ item, toggleOpen }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] =
      useState(false);

    return (
      <>
        <MenuItem>
          <button
            className='flex w-full text-sm font-medium text-gray-700'
            onClick={() =>
              setSubMenuOpen(!subMenuOpen)
            }
          >
            <div className='flex flex-row justify-between w-full items-center'>
              <span
                className={`${
                  pathname.includes(item.href)
                    ? 'font-bold text-blue-500'
                    : 'text-gray-700'
                }`}
              >
                {item.title}
              </span>
              <div
                className={`transition-transform duration-300 ${
                  subMenuOpen ? 'rotate-180' : ''
                }`}
              >
                <Icon
                  icon='lucide:chevron-down'
                  width='24'
                  height='24'
                  className='text-gray-600'
                />
              </div>
            </div>
          </button>
        </MenuItem>
        <div
          className={`flex flex-col ${
            !subMenuOpen ? 'hidden' : ''
          }`}
        >
          {item.subMenuItems?.map(
            (subItem, subIdx) => (
              <MenuItem
                key={subIdx}
                className='bg-transparent'
              >
                <Link
                  href={subItem.href}
                  onClick={() => toggleOpen()}
                  className={`block px-4 text-sm text-gray-700 hover:text-blue-600 ${
                    subItem.href === pathname
                      ? 'font-bold text-blue-500'
                      : ''
                  }`}
                >
                  <span className='flex items-center gap-2'>
                    {subItem.icon}
                    {subItem.title}
                  </span>
                </Link>
              </MenuItem>
            )
          )}
        </div>
      </>
    );
  };

  const MenuItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
        duration: 0.02,
      },
    },
  };

  const variants = {
    open: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.15,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.01,
        staggerDirection: -1,
      },
    },
  };

  const pathname = usePathname();
  const containerRef =
    useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(
    false,
    true
  );
  const user = false;

  return (
    <div>
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        custom={height}
        className={`fixed inset-0 z-50 w-full lg:hidden ${
          isOpen ? '' : 'pointer-events-none'
        }`}
        ref={containerRef}
      >
        <motion.div
          className='absolute inset-0 right-0 w-full bg-white shadow-lg'
          variants={sidebar}
        />
        <motion.ul
          variants={variants}
          className='absolute grid w-full gap-2 px-4 py-16 max-h-screen overflow-y-auto'
        >
          {navItems.map((item, idx) => {
            const isLastItem =
              idx === navItems.length - 1;

            return (
              <div key={idx}>
                {item.submenu ? (
                  <MenuItemWithSubMenu
                    item={item}
                    toggleOpen={toggleOpen}
                  />
                ) : (
                  <MenuItem>
                    <Link
                      href={item.href}
                      onClick={() => toggleOpen()}
                      className={`flex w-full text-sm font-medium text-gray-700 ${
                        item.href === pathname
                          ? 'font-bold text-blue-500'
                          : ''
                      }`}
                    >
                      {item.title}
                    </Link>
                  </MenuItem>
                )}

                {isOpen && !isLastItem && (
                  <div className='h-px w-full bg-gray-300' />
                )}
              </div>
            );
          })}
          {isOpen && (
            <>
              {user ? (
                <Link href='/'>
                  <Button className='h-9 font-bold w-full'>
                    out{' '}
                  </Button>
                </Link>
              ) : (
                <Link href='/login'>
                  <Button className='h-9 font-bold w-full'>
                    Sign in
                  </Button>
                </Link>
              )}
            </>
          )}
        </motion.ul>
        <div className='flex mr-14 items-center justify-between pt-2 z-50'>
          <div className='flex-1 text-right mt-3 pointer-events-auto'>
            <NavIconButtons />
          </div>
          <MenuToggle toggle={toggleOpen} />
        </div>
        <div className='absolute top-5 left-4 flex items-center gap-2 pointer-events-auto'>
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <Image
              src='/assets/images/logo.png'
              width={30}
              height={30}
              alt='logo'
              className='ml-2'
            />
          </Link>
        </div>
      </motion.nav>
    </div>
  );
};

export default Mobile;
