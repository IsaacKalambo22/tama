import { ShopProps } from '@/lib/api';
import ShopCard from '../shop-card';
interface Props {
  shops: ShopProps[];
}
const ShopList = ({ shops }: Props) => {
  return (
    <div className='w-full grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 '>
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
};

export default ShopList;
