import { fetchShops } from '@/lib/api';
import AddNewHeader from '@/modules/common/add-new-header';
import ShopList from './shop-list';

const Shop = async () => {
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
          Failed to load shops.
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
      {shops.length > 0 ? (
        <ShopList shops={shops} />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No shops available. Create a new shop to
          get started!
        </p>
      )}
    </div>
  );
};

export default Shop;
