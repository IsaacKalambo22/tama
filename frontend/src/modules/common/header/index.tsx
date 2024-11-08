import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  name: string;
  buttonText?: string;
  href?: string;
  isSmallText?: boolean;
};

const Header = ({
  name,
  buttonText,
  href,
  isSmallText = false,
}: Props) => {
  return (
    <div className='mb-5 flex w-full items-center justify-between'>
      <h1
        className={`${
          isSmallText ? 'text-lg' : 'text-2xl'
        } font-semibold dark:text-white`}
      >
        {name}
      </h1>
      {href && (
        <Link href={href}>
          <Button variant='ghost'>
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
