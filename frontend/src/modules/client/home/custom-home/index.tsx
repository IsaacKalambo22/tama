import { Card } from '@/components/ui/card';
import {
  FaStore,
  FaUsers,
  FaUsersCog,
  FaWarehouse,
} from 'react-icons/fa'; // Add more icons as needed
import { CustomFaq } from '../custom-faq';
import { ImageTextHome } from '../image-text-home';
import { MainCarousel } from '../main-carousel';
import OurTeam from '../our-team';
import StatisticBlock from '../statistic-block';

const CustomHome = () => {
  return (
    <div className='flex flex-col items-center gap-8 mb-16'>
      <MainCarousel />
      <div className='w-full flex items-center justify-center '>
        <span className='px-4 font-bold green_gradient text-4xl'>
          Discover More
        </span>
      </div>
      <div className='flex flex-col gap-20'>
        <ImageTextHome
          imagePath='/assets/images/carousel/9.jpg'
          heading='Who We Are'
          description='We at The TAMA Farmers Trust believe that the success of the nation lies in the concerted efforts of all stakeholders in the economy.'
        />
        <ImageTextHome
          imagePath='/assets/images/carousel/11.jpg'
          heading='Working Together with Farmers'
          description='TAMA Farmers Trust works together with smallholder farmers, medium to large farmers, and corporate farmers for the sustainability of the Malawi economy.'
          imagePosition='right'
        />
        <ImageTextHome
          imagePath='/assets/images/carousel/2.jpg'
          heading='Our Mission'
          description='To provide visible and compelling services to the grower members and perpetuate sustainable balance in the generation of wealth in a manner that ascertains wider income diversification and value.'
        />
        <ImageTextHome
          imagePath='/assets/images/carousel/13.jpg'
          heading='Our Vision'
          description='To be the most effective and successful Association in the representation of grower member interests in promoting tobacco production and marketing.'
          imagePosition='right'
        />
      </div>
      <div className='w-full flex items-center justify-center '>
        <span className='px-4 font-bold green_gradient text-4xl'>
          Community Stats
        </span>
      </div>
      <Card className='mx-auto w-full border-none h-auto shadow-none'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 '>
          <StatisticBlock
            count={51_000}
            label='Registered customers'
            icon={<FaUsers />}
          />
          <StatisticBlock
            count={63}
            label='Councilors'
            icon={<FaUsersCog />}
          />
          <StatisticBlock
            count={50}
            label='Cooperatives'
            icon={<FaWarehouse />}
          />
          <StatisticBlock
            count={5}
            label='Shops'
            icon={<FaStore />}
          />
        </div>
      </Card>
      <OurTeam />

      <div className='flex flex-col gap-1'>
        <h2 className='text-4xl font-bold text-center green_gradient'>
          Frequently Asked Questions
        </h2>
        <p className='text-gray-600 text-lg text-center'>
          Have questions? We&apos;ve got answers
          to help you understand more about what
          we do and how we can assist you.
        </p>
      </div>
      <CustomFaq />
    </div>
  );
};

export default CustomHome;
