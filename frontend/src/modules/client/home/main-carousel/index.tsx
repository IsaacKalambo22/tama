import { fetchHomeCarousel } from '@/lib/api';
import { CustomCarousel } from './custom-carousel';

const MainCarousel = async () => {
  let homeCarousel = [];
  try {
    homeCarousel = await fetchHomeCarousel(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch homeCarousel:',
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
      {homeCarousel?.length === 0 ? (
        <p className='text-gray-500 text-center text-lg mt-5'>
          No data currently available.
        </p>
      ) : (
        <CustomCarousel
          homeCarousel={homeCarousel}
        />
      )}
    </div>
  );
};

export default MainCarousel;
