import HeaderText from '@/modules/common/header-text';
import ShopCard from './shop-card';
import ShopItemCard from './shop-item-card';

const Shops = () => {
  return (
    <div className='flex flex-col items-center gap-12 mb-16'>
      <HeaderText
        title='Discover Our Locations'
        subtitle='Find Our Trusted Stores Near You'
      />

      {/* Shop Locations */}
      <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        <ShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Kasiya Shop'
          address='123 Main St, City'
          openingHours='Open: Mon-Sat 9am - 6pm'
        />
        <ShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <ShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <ShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <ShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <ShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
      </div>

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
    </div>
  );
};

export default Shops;
