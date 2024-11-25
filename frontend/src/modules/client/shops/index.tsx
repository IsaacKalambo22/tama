import { fetchShops } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import HeaderText from '@/modules/common/header-text';
import ShopCard from './shop-card';
import ShopItemCard from './shop-item-card';

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
      <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-16 mb-16'>
        <HeaderText
          title='Discover Our Locations'
          subtitle='Find Our Trusted Stores Near You'
        />

        <p className='text-red-500'>
          Failed to load shops and documents.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full max-w-7xl mx-auto gap-16 mb-16 px-4 sm:px-6 lg:px-8'>
      <HeaderText
        title='Discover Our Locations'
        subtitle='Find Our Trusted Stores Near You'
      />

      {/* Render the files */}
      <>
        {shops.length > 0 ? (
          <div className='file-list w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {shops.map((shop) => (
              <ShopCard
                key={shop.id}
                imageUrl={`${BASE_URL}/uploads/${shop.imageUrl}`}
                name={shop.name}
                address={shop.address}
                openingHours={shop.openHours}
              />
            ))}
          </div>
        ) : (
          <p className='empty-list'>
            No Reports and Publications
          </p>
        )}
        {/* Items for Sale */}
        <HeaderText
          title='Available Items'
          subtitle='Browse Items at Our Shops'
        />
        <div className='grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'>
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
          <ShopItemCard
            imageUrl='/assets/images/shop1.jpg'
            name='Syngenta'
          />
        </div>
      </>
    </div>
  );
};

export default Shops;
