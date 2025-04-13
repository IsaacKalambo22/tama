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

export function CustomCarousel({
  homeCarousel,
}: {
  homeCarousel: HomeCarousel[];
}) {
  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: true,
    })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className='w-full'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {homeCarousel?.map((slide, index) => (
          <CarouselItem key={index}>
            <div className='p-1 relative'>
              <Card className='w-full h-[25rem] sm:h-[35rem] shadow-none rounded-2xl relative overflow-hidden'>
                {/* Image with opacity */}
                <Image
                  src={slide.coverUrl}
                  alt={`Carousel image ${
                    index + 1
                  }`}
                  width={800}
                  height={1600}
                  className='w-full h-full object-cover rounded-2xl opacity-90'
                  priority={index === 0}
                  unoptimized
                />
                {/* Dark overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-50 rounded-2xl'></div>
                {/* Centered Text */}
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <h1 className='text-center font-bold flex flex-col leading-snug text-white drop-shadow-md'>
                    <span className='text-3xl sm:text-4xl '>
                      {slide.title}
                    </span>
                    <span className='text-2xl sm:text-2xl capitalize'>
                      {slide.description}
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
