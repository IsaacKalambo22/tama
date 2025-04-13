import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

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
  const userInitial = name
    .charAt(0)
    .toUpperCase(); // Get the first letter of the user's name

  return (
    <Card className='w-full lg:w-64 h-auto gap-2 rounded-2xl shadow-none px-5 py-8'>
      <div className='flex justify-center items-center'>
        <Avatar className='w-32 h-32'>
          <AvatarImage
            src={imageSrc}
            alt={`${name}'s profile`}
          />
          <AvatarFallback>
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className='flex flex-col gap-2 mt-4 items-center'>
        <h2 className='font-medium text-center'>
          {name}
        </h2>
        <p className='text-sm text-neutral-500'>
          {role}
        </p>
      </div>
    </Card>
  );
};

export default AvatarCard;
