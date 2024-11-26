'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';

export function ImageTextHome() {
  const imagePath =
    '/assets/images/carousel/11.jpg'; // Replace with your actual image path

  return (
    <Card className='flex flex-col rounded-2xl sm:flex-row items-center bg-white shadow-none overflow-hidden'>
      {/* Left: Image */}
      <div className='relative w-full sm:w-1/2 h-64 sm:h-auto'>
        <Image
          src={imagePath}
          alt='Working Together'
          width={800} // Replace with actual width
          height={600} // Replace with actual height
          className='w-full h-full object-cover'
        />
      </div>

      {/* Right: Text */}
      <div className='p-6 sm:w-1/2 flex flex-col justify-center items-center h-full text-center'>
        <h2 className='text-2xl sm:text-3xl font-bold mb-4 green_gradient'>
          Working Together with Farmers
        </h2>
        <p className='text-gray-600 text-lg leading-relaxed'>
          TAMA Farmers Trust works together with
          smallholder farmers, medium to large
          farmers, and corporate farmers for the
          sustainability of the Malawi economy.
        </p>
      </div>
    </Card>
  );
}
