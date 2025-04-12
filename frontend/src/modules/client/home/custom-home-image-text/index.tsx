import { fetchHomeImageText } from '@/lib/api';
import { ImageTextHome } from './image-text-home';

const CustomHomeImageText = async () => {
  let homeImageText = [];
  try {
    homeImageText = await fetchHomeImageText(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch homeImageText:',
      error
    );
    return (
      <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-16 mb-16'>
        <p className='text-red-500'>
          Failed to load home carousel.
        </p>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-10 mb-16'>
      {homeImageText?.length === 0 ? (
        <p className='text-gray-500 text-center text-lg mt-5'>
          No data currently available.
        </p>
      ) : (
        homeImageText?.map((item, index) => (
          <div
            key={item.id || index}
            className='flex flex-col gap-20'
          >
            <ImageTextHome
              imagePath={item.imageUrl}
              heading={item.heading}
              description={item.description}
              imagePosition={
                index % 2 === 0 ? 'left' : 'right'
              } // Even index: left, Odd index: right
            />
          </div>
        ))
      )}
    </div>
  );
};

export default CustomHomeImageText;
