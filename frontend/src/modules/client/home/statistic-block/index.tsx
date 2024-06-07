import { Card } from '@/components/ui/card';
import { formatCount } from '@/lib/utils';

interface StatisticBlockProps {
  count: string | number;
  label: string;
  icon: JSX.Element; // Icon prop
}

const StatisticBlock = ({
  count,
  label,
  icon,
}: StatisticBlockProps) => {
  return (
    <Card className='flex flex-col items-center p-6 rounded-2xl shadow-none'>
      <div className=' text-4xl mb-4 text-gray-700'>
        {icon}
      </div>
      <h1 className='text-[2.5rem] font-bold text-gray-700 '>
        {formatCount(count)}
      </h1>
      <p className=' mt-2 text-lg font-medium text-gray-700'>
        {label}
      </p>
    </Card>
  );
};

export default StatisticBlock;
