import { Card } from '@/components/ui/card';
import HeaderText from '@/modules/common/header-text';
import { FrequentlyAskedQuestions } from '../faquestion';
import HomeTextCard from '../home-text-card';
import { MainCarousel } from '../main-carousel';
import StatisticBlock from '../statistic-block';

const CustomHome = () => {
  return (
    <div className='flex flex-col items-center gap-16 mb-16'>
      <MainCarousel />
      <HeaderText
        title='TAMA Farmers Trust'
        subtitle='Leading farmers to prosperity'
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 w-full  gap-12 '>
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
      <Card className='mx-auto w-full h-auto p-4 shadow-none'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4'>
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
          <StatisticBlock
            count={5}
            label='Shops'
          />
        </div>
      </Card>

      <FrequentlyAskedQuestions />
    </div>
  );
};

export default CustomHome;
