import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ShopCardProps {
  imageUrl: string;
  name: string;
  address: string;
  openingHours: string;
}

const ShopCard = ({
  imageUrl,
  name,
  address,
  openingHours,
}: ShopCardProps) => (
  <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg cursor-pointer transition-shadow'>
    <Image
      src={imageUrl}
      alt={name}
      width={300}
      height={200}
      className='rounded-2xl mb-4'
    />
    <h2 className='text-xl font-semibold mb-2'>
      {name}
    </h2>
    <p className='text-gray-600'>{address}</p>
    <p className='text-gray-500'>
      {openingHours}
    </p>
  </Card>
);

export default ShopCard;
