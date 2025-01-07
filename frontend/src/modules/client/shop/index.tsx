import { fetchShops } from '@/lib/api';
import HeaderText from '@/modules/client/header-text';
import ShopList from './shop-list';

const Shops = async () => {
  let shops = [];
  try {
    shops = await fetchShops(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch shops:',
      error
    );

    return (
      <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-10 mb-16'>
        <HeaderText
          title='Discover Our Locations'
          subtitle='Find Our Trusted Stores Near You'
        />

        <p className='text-red-500'>
          Failed to load shops.
        </p>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-10 mb-16'>
      <HeaderText
        title='Discover Our Locations'
        subtitle='Find Our Trusted Stores Near You'
      />

      {shops?.length > 0 ? (
        <div className='flex flex-col w-full max-w-7xl mx-auto gap-10'>
          <ShopList shops={shops} />
        </div>
      ) : (
        <p className='text-gray-500 text-center text-lg mt-5'>
          No shops are currently available.
        </p>
      )}
    </div>
  );
};

export default Shops;
