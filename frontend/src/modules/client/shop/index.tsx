import { fetchShops } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import ShopItemCard from './shop-item-card';
import ShopList from './shop-list';

const Shops = async () => {
  // Fallback shop items
  const shopItems = Array.from(
    { length: 10 },
    (_, index) => ({
      id: index + 1,
      imageUrl: `/assets/images/carousel/${
        index + 1
      }.jpg`,
      name: `Perique ${index + 1}`,
    })
  );
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
    <div className='flex flex-col w-full max-w-7xl mx-auto gap-10 mb-20'>
      <HeaderText
        title='Discover Our Locations'
        subtitle='Find Our Trusted Stores Near You'
      />

      {/* Render the files */}
      <>
        {shops.length > 0 ? (
          <div className='flex flex-col w-full max-w-7xl mx-auto gap-10'>
            <ShopList shops={shops} />
          </div>
        ) : (
          <p className='empty-list'>No shops</p>
        )}
        {/* Items for Sale */}
        <HeaderText
          title='Available Items'
          subtitle='Browse Items at Our Shops'
        />
        <div className='grid gap-8 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4'>
          {shopItems.map((item) => (
            <ShopItemCard
              key={item.id}
              imageUrl={item.imageUrl}
              name={item.name}
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default Shops;
