import { ShopProps } from '@/lib/api';
import NewShopCard from '../../new-shop-card';
interface Props {
    shops: ShopProps[]
}
const ShopList = ({shops}:Props) => {
  return (
 <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {shops.map((shop) => (
          <NewShopCard
            key={shop.id}
            shop={shop}
           
          />
        ))}
      </div>  )
}

export default ShopList