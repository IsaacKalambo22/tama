import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import { Facebook } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { navItems } from '../constants/nav-items';

const Footer = () => {
  return (
    <Card className='w-full min-w-full bg-[#FFFFFF66] max-w-screen-2xl p-8 sm:p-20 shadow-none'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Column 1 - Logo and Text */}
        <div>
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <Image
              src='/assets/images/logo.png'
              alt='logo'
              width={50}
              height={50}
            />
          </Link>
          <p className='my-4 text-gray-600 text-[.9rem] font-sans font-normal'>
            Leading farmers to prosperity.
          </p>
          <p className='mb-4 text-gray-600 text-[.9rem] font-sans font-normal'>
            © 2024 tama@tamalawi.com
          </p>
          <div className='flex space-x-4'>
            <Link href='https://twitter.com/'>
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <TwitterLogoIcon />
              </Button>
            </Link>
            <Link href='https://github.com/'>
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <GitHubLogoIcon />
              </Button>
            </Link>
            <Link href='https://linkedin.com/'>
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <LinkedInLogoIcon />
              </Button>
            </Link>
            <Link href='https://facebook.com/'>
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <Facebook />
              </Button>
            </Link>
          </div>
        </div>

        {/* Column 2 - Tobacco Business Links */}
        <div>
          <h3 className='font-semibold mb-4 text-gray-900'>
            Tobacco Business
          </h3>
          <ul className='flex flex-col gap-3'>
            {navItems
              .filter(
                (item) =>
                  item.title ===
                  'Tobacco Business'
              )
              .map((item) =>
                item.subMenuItems?.map(
                  (subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  )
                )
              )}
          </ul>
        </div>

        {/* Column 3 - Resources Links */}
        <div>
          <h3 className='font-semibold mb-4 text-gray-900'>
            Resources
          </h3>
          <ul className='flex flex-col gap-3'>
            {navItems
              .filter(
                (item) =>
                  item.title === 'Resources'
              )
              .map((item) =>
                item.subMenuItems?.map(
                  (subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  )
                )
              )}
          </ul>
        </div>

        {/* Column 4 - Contact Us */}
        <div>
          <h3 className='font-semibold mb-4 text-gray-900'>
            Contact Us
          </h3>
          <div className='flex flex-col gap-3'>
            <address className='text-gray-600'>
              TAMA HOUSE, Independence Avenue,
              <br />
              P.O. Box 31360, Capital City,
              <br />
              Lilongwe 3, Malawi
            </address>
            <p className='text-gray-600'>
              Email:{' '}
              <a
                href='mailto:tama@tamalawi.com'
                className='hover:text-gray-900'
              >
                tama@tamalawi.com
              </a>
            </p>
            <p className='text-gray-600'>
              Phone: 01 773 099
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Footer;
