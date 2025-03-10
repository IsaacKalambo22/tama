import { fetchHomeImageText } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import HomeImageTextList from './home-image-text-list';

const HomeImageText = async () => {
  let homeImageText: HomeImageText[];
  try {
    const response = await fetchHomeImageText();
    homeImageText = response || [];
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
      {homeImageText.length > 0 ? (
        <HomeImageTextList
          homeImageText={homeImageText}
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

export default HomeImageText;
