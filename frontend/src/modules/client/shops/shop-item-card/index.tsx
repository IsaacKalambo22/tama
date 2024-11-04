import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ShopItemCardProps {
  imageUrl: string;
  name: string;
}

const ShopItemCard = ({
  imageUrl,
  name,
}: ShopItemCardProps) => (
  <Card className='p-4 shadow-none rounded-3xl hover:shadow-md cursor-pointer transition-shadow'>
    <Image
      src={imageUrl}
      alt={name}
      width={200}
      height={150}
      className='rounded-2xl mb-2 object-cover'
    />
    <h3 className='text-lg font-medium text-center'>
      {name}
    </h3>
  </Card>
);

export default ShopItemCard;
