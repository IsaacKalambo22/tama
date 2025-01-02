import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DetailItem from '../detail-item';

const PersonalDetails = () => {
  return (
    <Card className='gap-4 rounded-2xl shadow-none py-4'>
      <h1 className='text-lg font-bold text-gray-800 px-4'>
        Personal Details
      </h1>
      <Separator className='my-4' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-4'>
        <DetailItem
          label='Full Name'
          value='Resten Madzalo'
        />
        <DetailItem
          label='Phone'
          value='(+1-876) 8654 239 581'
        />
        <DetailItem
          label='Email'
          value='madzaloresten8@gmail.com'
        />
        <DetailItem
          label='District'
          value='Lilongwe'
        />
      </div>
    </Card>
  );
};

export default PersonalDetails;
