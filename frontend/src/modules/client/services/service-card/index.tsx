'use client';

import { Card } from '@/components/ui/card';
import { ServiceProps } from '@/lib/api';
import Image from 'next/image';

interface ServiceCardProps {
  service: ServiceProps;
}

const ServiceCard = ({
  service,
}: ServiceCardProps) => {
  return (
    <Card className='shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6'>
      <div className='relative w-full h-[12rem]'>
        <Image
          src={service.imageUrl}
          alt={service.title}
          layout='fill'
          objectFit='cover'
          className='rounded-2xl'
          unoptimized
        />
      </div>
      <div className='pt-3'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
          {service.title}
        </h3>
        <p className='text-gray-600 text-sm leading-relaxed'>
          {service.description}
        </p>
      </div>
    </Card>
  );
};

export default ServiceCard;
