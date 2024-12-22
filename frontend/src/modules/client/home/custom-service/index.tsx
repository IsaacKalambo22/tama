'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
}

const services: ServiceItem[] = [
  {
    title: 'Satellite Depot Operations',
    description:
      'Receiving centers for tobacco haulage to floors markets. Act as information centers for farmers and outlets for service deliveries like Hessian distribution.',
    imageUrl: '/assets/images/carousel/1.jpg',
  },
  {
    title: 'Hessian Services',
    description:
      'Offers subsidized Hessian schemes to members. Collects Hessians from buyers, replenishes ex-rated pieces, and purchases new pieces for growing members.',
    imageUrl: '/assets/images/carousel/2.jpg',
  },
  {
    title: 'Transportation Brokerage',
    description:
      'Contracts transporters to haul members’ tobacco to auction floors. Ensures safety by using licensed and insured transporters.',
    imageUrl: '/assets/images/carousel/3.jpg',
  },
  {
    title: 'Customer Service',
    description:
      'Dedicated query handling for growers with prompt resolutions.',
    imageUrl: '/assets/images/carousel/4.jpg',
  },
  {
    title: 'Policy Lobbying and Advocacy',
    description:
      'Represents growers in policy formulation and industry boards. Ensures participation in interactive area meetings.',
    imageUrl: '/assets/images/carousel/5.jpg',
  },
  {
    title: 'Tobacco Marketing and Promotions',
    description:
      'Promotes Malawi Tobacco globally through ITGA. Collaborates with ARET for extension services and market tours.',
    imageUrl: '/assets/images/carousel/6.jpg',
  },
  {
    title: 'Tobacco Sales Representation',
    description:
      'Represents growers on auction floors and negotiates for better pricing on contract sales.',
    imageUrl: '/assets/images/carousel/7.jpg',
  },
  {
    title: 'Media and Mass Communications',
    description:
      'Publishes newsletters, magazines, and reports. Conducts area and council meetings for updates and feedback.',
    imageUrl: '/assets/images/carousel/8.jpg',
  },
  {
    title: 'Extension Services',
    description:
      'Collaborates with ARET for research and education. Provides extension services through business officers nationwide.',
    imageUrl: '/assets/images/carousel/9.jpg',
  },
  {
    title: 'Innovative Services',
    description:
      'Supports contract marketing and rehandling through operational grading centers. Ensures fair contract discharge.',
    imageUrl: '/assets/images/carousel/10.jpg',
  },
  {
    title: 'Rural and Electronic Banking',
    description:
      'Partnership with FMB for the Makwacha Card, enabling rural farmers to access proceeds and sales.',
    imageUrl: '/assets/images/carousel/11.jpg',
  },
  {
    title: 'Cooperatives',
    description:
      'Promotes ethical farming practices like child labor avoidance. Provides relief support and agricultural resources.',
    imageUrl: '/assets/images/carousel/12.jpg',
  },
];

export default function CustomService() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto'>
      {services.map((service, index) => (
        <Card
          key={index}
          className='shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6'
        >
          <div className='relative w-full h-[12rem]'>
            <Image
              src={service.imageUrl}
              alt={service.title}
              layout='fill'
              objectFit='cover'
              className='rounded-2xl'
              priority={index === 0} // Optimize the first image
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
      ))}
    </div>
  );
}
