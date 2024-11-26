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
            <div className='p-1'>
              <Card className='w-full h-[25rem] sm:h-[40rem] shadow-none rounded-2xl'>
                <Image
                  src={imagePath}
                  alt={`Carousel image ${
                    index + 1
                  }`}
                  width={800} // Replace with actual width of the image
                  height={1600} // Replace with actual height of the image
                  className='w-full h-full object-cover rounded-2xl'
                  priority={index === 0} // Set priority for the first image
                />
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
