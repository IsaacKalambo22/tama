import { Card } from '@/components/ui/card';

interface HomeTextCardProps {
  title: string;
  description: string;
}

const HomeTextCard = ({
  title,
  description,
}: HomeTextCardProps) => {
  return (
    <Card className='flex flex-col  rounded-3xl cursor-pointer items-center p-8 w-full text-center hover:border-green-500 transition-transform transform hover:scale-105 shadow-none'>
      <span className='green_subtitle font-bold text-lg md:text-xl lg:text-2xl mb-4'>
        {title}
      </span>
      <p className='text-gray-700 text-base md:text-lg leading-relaxed'>
        {description}
      </p>
    </Card>
  );
};

export default HomeTextCard;
