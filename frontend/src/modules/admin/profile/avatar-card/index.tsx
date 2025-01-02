import { Card } from '@/components/ui/card';
import Image from 'next/image';
import SocialMediaIcons from '../social-media-icons';

interface AvatarCardProps {
  name: string;
  role: string;
  imageSrc: string;
}

const AvatarCard = ({
  name,
  role,
  imageSrc,
}: AvatarCardProps) => {
  return (
    <Card className='w-full lg:w-64 h-auto gap-2 rounded-2xl shadow-none p-5'>
      <div className='flex justify-center items-center'>
        <div className='w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-amber-100 flex items-center justify-center'>
          <Image
            src={imageSrc}
            alt={`${name}'s profile`}
            width={80}
            height={80}
            className='rounded-full'
          />
        </div>
      </div>
      <div className='flex flex-col gap-2 my-4 items-center'>
        <h2 className='font-medium text-center'>
          {name}
        </h2>
        <p className='text-sm text-neutral-500'>
          {role}
        </p>
      </div>
      <SocialMediaIcons />
    </Card>
  );
};

export default AvatarCard;
