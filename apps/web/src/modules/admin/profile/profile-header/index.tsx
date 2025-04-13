import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface ProfileHeaderProps {
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

const ProfileHeader = ({
  title,
  description,
  link,
  buttonText,
}: ProfileHeaderProps) => {
  return (
    <Card className='flex flex-col sm:flex-row justify-between items-center mt-5 shadow-sm h-auto sm:h-28 border rounded-lg px-5 sm:px-10 py-5 sm:py-0'>
      <div>
        <h1 className='font-medium text-lg sm:text-xl'>
          {title}
        </h1>
        <p className='text-sm text-gray-500 mt-2 sm:mt-0'>
          {description}
        </p>
      </div>
      <Link href={link}>
        <Button className='font-medium mt-4 sm:mt-0'>
          {buttonText}
        </Button>
      </Link>
    </Card>
  );
};

export default ProfileHeader;
