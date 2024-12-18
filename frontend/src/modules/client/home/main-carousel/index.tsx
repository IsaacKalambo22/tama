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
      delay: 5000,
      stopOnInteraction: true,
    })
  );

  // Array of image data
  const slides = [
    {
      imagePath: '/assets/images/carousel/1.jpg',
      title: 'TAMA Farmers Trust',
      subtitle: 'Leading farmers to prosperity',
    },
    {
      imagePath: '/assets/images/carousel/7.jpg',
      title: 'Empowering Farmers',
      subtitle:
        'Innovative solutions for agriculture',
    },
    {
      imagePath: '/assets/images/carousel/5.jpg',
      title: 'Sustainable Growth',
      subtitle: 'Fostering long-term development',
    },
    {
      imagePath: '/assets/images/carousel/6.jpg',
      title: 'Community Impact',
      subtitle: 'Strengthening local economies',
    },
    {
      imagePath: '/assets/images/carousel/8.jpg',
      title: 'Advanced Technology',
      subtitle: 'Modern tools for better yields',
    },
    {
      imagePath: '/assets/images/carousel/9.jpg',
      title: 'Global Reach',
      subtitle: 'Connecting farmers worldwide',
    },
    {
      imagePath: '/assets/images/carousel/10.jpg',
      title: 'Trusted Partnerships',
      subtitle: 'Collaborating for success',
    },
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className='w-full'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className='p-1 relative'>
              <Card className='w-full h-[25rem] sm:h-[40rem] shadow-none rounded-2xl relative overflow-hidden'>
                {/* Image with opacity */}
                <Image
                  src={slide.imagePath}
                  alt={`Carousel image ${
                    index + 1
                  }`}
                  width={800}
                  height={1600}
                  className='w-full h-full object-cover rounded-2xl opacity-90'
                  priority={index === 0}
                />
                {/* Dark overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-50 rounded-2xl'></div>
                {/* Centered Text */}
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <h1 className='text-center font-bold flex flex-col leading-snug text-white drop-shadow-md'>
                    <span className='text-3xl sm:text-5xl'>
                      {slide.title}
                    </span>
                    <span className='text-2xl sm:text-3xl'>
                      {slide.subtitle}
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
