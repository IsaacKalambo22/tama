import { Card } from '@/components/ui/card';
import { FrequentlyAskedQuestions } from './faquestion';
import HomeTextCard from './home-text-card';
import StatisticBlock from './statistic-block';

const Home = () => {
  return (
    <div className='flex flex-col items-center gap-16 mb-16'>
      <h1 className='text-center mt-10 font-bold text-3xl sm:text-5xl leading-snug'>
        <span className='green_gradient'>
          TAMA Farmers Trust
        </span>
        <br />
        <span className='green_subtitle'>
          Leading farmers to prosperity
        </span>
        <br />
      </h1>

      <div className='flex w-full flex-wrap justify-center gap-12 '>
        <HomeTextCard
          title='Working Together with Farmers'
          description='TAMA Farmers Trust works together with smallholder farmers, medium to large farmers, and corporate farmers for the sustainability of the Malawi economy.'
        />
        <HomeTextCard
          title='Who We Are'
          description='We at The TAMA Farmers Trust believe that the success of the nation lies in the concerted efforts of all stakeholders in the economy.'
        />
        <HomeTextCard
          title='Our Mission'
          description='To provide visible and compelling services to the grower members and perpetuate sustainable balance in the generation of wealth in a manner that ascertains wider income diversification and value.'
        />
        <HomeTextCard
          title='Our Vision'
          description='To be the most effective and successful Association in the representation of grower member interests in promoting tobacco production and marketing.'
        />
      </div>
      <Card className='flex mx-auto w-full flex-wrap justify-around items-center h-32 shadow-none'>
        <StatisticBlock
          count={51_000}
          label='Registered customers'
        />
        <StatisticBlock
          count={63}
          label='Councilors'
        />
        <StatisticBlock
          count={50}
          label='Cooperatives'
        />
        <StatisticBlock count={5} label='Shops' />
      </Card>
      <FrequentlyAskedQuestions />
    </div>
  );
};

export default Home;
