import { fetchShops } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import AddNewHeader from '@/modules/common/add-new-header';
import CustomShopCard from './custom-shop-card';

const CustomShop = async () => {
  let shops = [];
  try {
    shops = await fetchShops(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch shops:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Shop List'
          buttonName='New Shop'
        />
        <p className='text-red-500'>
          Failed to load shops and publications.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Shop List'
        buttonName='New Shop'
      />
      <div className='grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {shops.map((shop) => (
          <CustomShopCard
            key={shop.id}
            imageUrl={`${BASE_URL}/uploads/${shop.imageUrl}`}
            name={shop.name}
            address={shop.address}
            openingHours={shop.openHours}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomShop;
