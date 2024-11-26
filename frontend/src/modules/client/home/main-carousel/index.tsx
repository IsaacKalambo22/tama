'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import * as React from 'react';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function MainCarousel() {
  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: true,
    })
  );

  // Array of image paths
  const imagePaths = Array.from(
    { length: 14 },
    (_, index) =>
      `/assets/images/carousel/${index + 1}.jpg`
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className='w-full'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {imagePaths.map((imagePath, index) => (
          <CarouselItem key={index}>
            <div className='p-1 relative'>
              <Card className='w-full h-[25rem] sm:h-[40rem] shadow-none rounded-2xl relative overflow-hidden'>
                {/* Image with opacity */}
                <Image
                  src={imagePath}
                  alt={`Carousel image ${
                    index + 1
                  }`}
                  width={800}
                  height={1600}
                  className='w-full h-full object-cover rounded-2xl opacity-90' // Reduced opacity for dim effect
                  priority={index === 0}
                />
                {/* Dark overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-50 rounded-2xl'></div>
                {/* Centered Text */}
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  {/* <HeaderText
                    title='TAMA Farmers Trust'
                    subtitle='Leading farmers to prosperity'
                  /> */}
                  <h1 className='text-center font-bold flex flex-col leading-snug text-white drop-shadow-md'>
                    <span className='text-3xl sm:text-5xl'>
                      TAMA Farmers Trust
                    </span>
                    <span className='text-2xl sm:text-4xl'>
                      Leading farmers to
                      prosperity
                    </span>
                  </h1>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
