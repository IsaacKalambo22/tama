import { Card } from '@/components/ui/card';
import {
  FaStore,
  FaUsers,
  FaUsersCog,
  FaWarehouse,
} from 'react-icons/fa';
import { CustomFaq } from './custom-faq';
import CustomHomeImageText from './custom-home-image-text';
import MainCarousel from './main-carousel';
import OurTeam from './our-team';
import StatisticBlock from './statistic-block';

const Home = async () => {
  return (
    <div className='flex flex-col items-center gap-8 mb-16'>
      <MainCarousel />
      <div className='w-full flex items-center justify-center '>
        <span className='home-text'>
          Discover More
        </span>
      </div>
      <CustomHomeImageText />

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

export default Home;
