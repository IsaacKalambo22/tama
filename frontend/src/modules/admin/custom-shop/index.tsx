import AddNewHeader from '@/modules/common/add-new-header';
import CustomShopCard from './custom-shop-card';

const CustomShop = () => {
  return (
    <div className='flex flex-col  gap-2 mb-16'>
      <AddNewHeader
        name='Shop List'
        buttonName='New Shop'
      />

      {/* Shop Locations */}
      <div className='grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <CustomShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Kasiya Shop'
          address='123 Main St, City'
          openingHours='Open: Mon-Sat 9am - 6pm'
        />
        <CustomShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <CustomShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <CustomShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <CustomShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
        <CustomShopCard
          imageUrl='/assets/images/shop1.jpg'
          name='Market Plaza'
          address='456 Center Rd, City'
          openingHours='Open: Mon-Fri 10am - 5pm'
        />
      </div>
    </div>
  );
};

export default CustomShop;
