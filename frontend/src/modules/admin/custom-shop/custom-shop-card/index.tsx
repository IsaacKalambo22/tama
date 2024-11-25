import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface CustomShopCardProps {
  imageUrl: string;
  name: string;
  address: string;
  openingHours: string;
}

const CustomShopCard = ({
  imageUrl,
  name,
  address,
  openingHours,
}: CustomShopCardProps) => (
  <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg cursor-pointer transition-shadow'>
    <Image
      src={imageUrl}
      alt={name}
      width={200}
      height={150}
      className='rounded-2xl w-full mb-4 h-[12rem]'
    />
    <h2 className='text-[1rem] font-semibold mb-2'>
      {name}
    </h2>
    <p className='text-gray-700'>{address}</p>
    <p className='text-gray-500'>
      {openingHours}
    </p>
  </Card>
);

export default CustomShopCard;
