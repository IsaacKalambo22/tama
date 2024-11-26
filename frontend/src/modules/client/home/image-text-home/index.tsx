'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ImageTextProps {
  imagePath: string;
  heading: string;
  description: string;
  imagePosition?: 'left' | 'right'; // Optional prop to choose image position
}

export function ImageTextHome({
  imagePath,
  heading,
  description,
  imagePosition = 'left', // Default to 'left' if not provided
}: ImageTextProps) {
  return (
    <Card className='flex flex-col rounded-2xl border-none sm:flex-row items-center shadow-none overflow-hidden'>
      {/* Conditionally set flex row order */}
      <div
        className={`relative w-full sm:w-1/2 h-64 sm:h-auto ${
          imagePosition === 'right'
            ? 'order-2'
            : ''
        }`}
      >
        <Image
          src={imagePath}
          alt={heading}
          width={800} // Replace with actual width
          height={600} // Replace with actual height
          className='w-full h-full object-cover'
        />
      </div>

      {/* Right: Text */}
      <div
        className={`p-6 sm:w-1/2 flex flex-col justify-center items-center h-full text-center ${
          imagePosition === 'right'
            ? 'order-1'
            : ''
        }`}
      >
        <h2 className='text-2xl sm:text-3xl font-bold mb-4 green_gradient'>
          {heading}
        </h2>
        <p className='text-gray-600 text-lg leading-relaxed'>
          {description}
        </p>
      </div>
    </Card>
  );
}
