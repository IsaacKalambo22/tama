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
  <Card className='p-4 shadow-none hover:shadow-md cursor-pointer transition-shadow'>
    <Image
      src={imageUrl}
      alt={name}
      width={200}
      height={150}
      className='rounded-lg mb-2 object-cover'
    />
    <h3 className='text-lg font-medium text-center'>
      {name}
    </h3>
  </Card>
);

export default ShopItemCard;
