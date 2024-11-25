import { fetchShops } from '@/lib/api';
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
        name='Shops and Publications'
        buttonName='New Report or Publication'
      />
      <div className='grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {shops.map((shop) => (
          <CustomShopCard
            key={shop.id}
            imageUrl={shop.imageUrl}
            name={shop.name}
            address={shop.address}
            openingHours={shop.openHours}
          />
        ))}
      </div>
    </div>
  );
};

//   return (
//     <div className='flex flex-col  gap-2 mb-16'>
//       <AddNewHeader
//         name='Shop List'
//         buttonName='New Shop'
//       />

//       {/* Shop Locations */}
//       <div className='grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
//         <CustomShopCard
//           imageUrl='/assets/images/shop1.jpg'
//           name='Kasiya Shop'
//           address='123 Main St, City'
//           openingHours='Open: Mon-Sat 9am - 6pm'
//         />
//         <CustomShopCard
//           imageUrl='/assets/images/shop1.jpg'
//           name='Market Plaza'
//           address='456 Center Rd, City'
//           openingHours='Open: Mon-Fri 10am - 5pm'
//         />
//         <CustomShopCard
//           imageUrl='/assets/images/shop1.jpg'
//           name='Market Plaza'
//           address='456 Center Rd, City'
//           openingHours='Open: Mon-Fri 10am - 5pm'
//         />
//         <CustomShopCard
//           imageUrl='/assets/images/shop1.jpg'
//           name='Market Plaza'
//           address='456 Center Rd, City'
//           openingHours='Open: Mon-Fri 10am - 5pm'
//         />
//         <CustomShopCard
//           imageUrl='/assets/images/shop1.jpg'
//           name='Market Plaza'
//           address='456 Center Rd, City'
//           openingHours='Open: Mon-Fri 10am - 5pm'
//         />
//         <CustomShopCard
//           imageUrl='/assets/images/shop1.jpg'
//           name='Market Plaza'
//           address='456 Center Rd, City'
//           openingHours='Open: Mon-Fri 10am - 5pm'
//         />
//       </div>
//     </div>
//   );
// };

export default CustomShop;
