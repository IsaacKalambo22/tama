'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface ServiceCardProps {
  title: string;
  points: string[];
}

const ServiceCard = ({
  title,
  points,
}: ServiceCardProps) => {
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <Card className='flex flex-col rounded-3xl cursor-pointer items-center p-8 w-full text-center hover:border-green-500  shadow-none'>
      <span className='green_subtitle font-bold text-lg md:text-xl lg:text-2xl mb-4'>
        {title}
      </span>
      <div
        className={`transition-all duration-500 overflow-hidden ${
          showAll
            ? 'max-h-[1000px] opacity-100'
            : 'max-h-[160px] opacity-90'
        }`}
      >
        <ol className='text-gray-700 text-base text-left md:text-lg leading-relaxed list-decimal list-inside'>
          {points.map((point, index) => (
            <li key={index} className='mb-2'>
              {point}
            </li>
          ))}
        </ol>
      </div>
      {points.length > 5 && (
        <Button
          onClick={handleToggle}
          className='mt-4'
        >
          {showAll ? 'View Less' : 'View More'}
        </Button>
      )}
    </Card>
  );
};

export default ServiceCard;
