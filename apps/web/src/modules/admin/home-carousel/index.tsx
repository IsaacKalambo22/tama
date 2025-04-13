import { fetchHomeCarousel } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import HomeCarouselList from './home-carousel-list';

const HomeCarousel = async () => {
  let homeCarousel: HomeCarousel[];
  try {
    const response = await fetchHomeCarousel();
    homeCarousel = response || [];
  } catch (error) {
    console.error(
      'Failed to fetch home carousel:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Home Carousel'
          buttonName='New Carousel'
        />
        <p className='text-red-500'>
          Failed to load home carousel. Please try
          again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Home Carousel'
        buttonName='New Carousel'
      />
      {homeCarousel.length > 0 ? (
        <HomeCarouselList
          homeCarousel={homeCarousel}
        />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No home carousel available. Create a new
          carousel to get started!
        </p>
      )}
    </div>
  );
};

export default HomeCarousel;
