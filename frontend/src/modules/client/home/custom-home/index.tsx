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
        <span className='home-text'>
          Discover More
        </span>
      </div>
      <div className='flex flex-col gap-20'>
        <ImageTextHome
          imagePath='/assets/images/tama-images/3.jpg'
          heading='Who We Are'
          description='We at The TAMA Farmers Trust believe that the success of the nation lies in the concerted efforts of all stakeholders in the economy.'
        />
        <ImageTextHome
          imagePath='/assets/images/tama-images/1.jpg'
          heading='Working Together with Farmers'
          description='TAMA Farmers Trust works together with smallholder farmers, medium to large farmers, and corporate farmers for the sustainability of the Malawi economy.'
          imagePosition='right'
        />
        <ImageTextHome
          imagePath='/assets/images/tama-images/4.jpg'
          heading='Our Mission'
          description='To provide visible and compelling services to the grower members and perpetuate sustainable balance in the generation of wealth in a manner that ascertains wider income diversification and value.'
        />
        <ImageTextHome
          imagePath='/assets/images/tama-images/2.jpg'
          heading='Our Vision'
          description='To be the most effective and successful Association in the representation of grower member interests in promoting tobacco production and marketing.'
          imagePosition='right'
        />
      </div>
      <div className='w-full flex items-center justify-center '>
        <span className='home-text'>
          Community Stats
        </span>
      </div>
      <Card className='mx-auto bg-inherit w-full border-none h-auto shadow-none'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 '>
          <StatisticBlock
            count={18_000}
            label='Registered Growers'
            icon={<FaUsers />}
          />
          <StatisticBlock
            count={63}
            label='Councilors'
            icon={<FaUsersCog />}
          />
          <StatisticBlock
            count={3}
            label='Tobacco Grading Centers'
            icon={<FaWarehouse />}
          />
          <StatisticBlock
            count={54}
            label='Hessian & Tobacco Satellite Depots'
            icon={<FaStore />}
          />
        </div>
      </Card>
      <OurTeam />

      <div className='flex flex-col gap-1'>
        <span className='home-text'>
          Frequently Asked Questions
        </span>
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
