// app/news/page.tsx

'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import CustomError from '@/modules/common/custom-error';
import CustomLoader from '@/modules/common/custom-loader';
import HeaderText from '@/modules/common/header-text';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  imageUrl: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Replace with actual data fetch
    fetchNewsData()
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          'Error loading news:',
          error
        );
        setError(true);
        setLoading(false);
      });
  }, []);

  const fetchNewsData = async () => {
    return [
      {
        id: 1,
        title:
          'New Sustainable Agricultural Initiatives Launched',
        author: 'Admin',
        date: '2024-11-01',
        content:
          'TAMA has introduced new initiatives aimed at providing extensive support for farmers. These initiatives focus on enhancing access to resources, training, and financial aid for rural communities. Our goal is to empower farmers with tools and knowledge to improve their yields and secure their livelihoods. Programs include workshops on sustainable agriculture practices, access to microloans, and collaborations with agricultural experts to address challenges in the field. This is a monumental step forward in TAMA’s commitment to fostering agricultural prosperity.',
        imageUrl: '/assets/images/shop1.jpg',
      },
      {
        id: 2,
        title: 'Annual Farmers Conference',
        author: 'John Smith',
        date: '2024-10-20',
        content:
          'Join us for the upcoming annual conference to discuss advancements in farming techniques, technology, and industry trends. The conference will feature guest speakers from leading agricultural research institutions, as well as interactive sessions on topics such as crop management, soil health, and climate-resilient farming. Networking opportunities will allow farmers to connect with industry professionals, share experiences, and learn from one another. Don’t miss this opportunity to stay informed and connected in the ever-evolving field of agriculture.',
        imageUrl: '/assets/images/shop1.jpg',
      },
      {
        id: 3,
        title: 'Market Trends Report',
        author: 'Admin',
        date: '2024-10-15',
        content:
          'Our latest report on market trends for farmers is now available. This comprehensive report covers price changes, consumer demand, and emerging markets. Key insights include the growing demand for organic produce, the impact of global supply chains on local markets, and predictions for next season’s most profitable crops. The report also provides data-driven recommendations to help farmers make informed decisions about their crop choices and sales strategies.',
        imageUrl: '/assets/images/shop1.jpg',
      },
      {
        id: 4,
        title: 'Farming Techniques Webinar',
        author: 'Jane Doe',
        date: '2024-10-10',
        content:
          'Register for our free webinar on innovative farming techniques that are transforming agriculture today. Topics include precision agriculture, regenerative soil management, and eco-friendly pest control. The webinar will feature experts who will share their insights on optimizing crop yield, conserving water, and reducing costs. This online event is designed to provide practical knowledge that farmers can immediately apply to improve their productivity and sustainability efforts.',
        imageUrl: '/assets/images/shop1.jpg',
      },
      {
        id: 5,
        title: 'Sustainable Agriculture Efforts',
        author: 'Emily White',
        date: '2024-10-05',
        content:
          'Learn about our sustainable agriculture initiatives aimed at reducing environmental impact while maintaining high productivity. TAMA is committed to promoting practices that conserve water, enhance soil fertility, and reduce chemical use. Recent projects include partnerships with eco-friendly technology providers and the implementation of renewable energy sources on farms. These efforts aim to create a more sustainable and resilient agricultural sector for future generations.',
        imageUrl: '/assets/images/shop1.jpg',
      },
    ];
  };

  if (loading) return <CustomLoader />;

  if (error)
    return (
      <CustomError message='Failed to load news.' />
    );

  // Separate the most recent news item
  const [mostRecent, ...otherNews] = news;

  return (
    <div className='w-full p-8 space-y-6'>
      <HeaderText
        title='TAMA News'
        subtitle='Stay Informed with the Latest Updates and Announcements'
      />
      <div className='space-y-6'>
        {/* Most Recent Story */}
        {mostRecent && (
          <Card className='shadow-none rounded-lg border-none flex flex-col md:flex-row items-center sm:h-[17rem] gap-10'>
            <Image
              src={mostRecent.imageUrl}
              alt={mostRecent.title}
              width={400}
              height={300}
              className='rounded-2xl object-cover h-full w-full md:w-1/2'
            />
            <div className='flex flex-col justify-between w-full md:w-1/2 h-full space-y-4'>
              <div className='flex gap-2 items-center'>
                <Avatar>
                  <AvatarImage src='' />
                  <AvatarFallback>
                    A
                  </AvatarFallback>
                </Avatar>
                <p className='text-sm text-gray-500'>
                  {mostRecent.author} |{' '}
                  {mostRecent.date}
                </p>
              </div>
              <h3 className='text-3xl font-bold text-green-600'>
                {mostRecent.title}
              </h3>
              <p className='text-gray-700 mt-2 line-clamp-3'>
                {mostRecent.content}
              </p>
              <p className='text-gray-700 mt-2'>
                4 min read
              </p>
            </div>
          </Card>
        )}

        {/* Other News Stories */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {otherNews.slice(0, 4).map((item) => (
            <SmallNewsCard
              key={item.id}
              newsItem={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface NewsCardProps {
  newsItem: NewsItem;
}

const SmallNewsCard = ({
  newsItem,
}: NewsCardProps) => {
  return (
    <Card className='p-4 shadow-none cursor-pointer rounded-3xl space-y-4 transition-transform transform hover:scale-105'>
      <Image
        src={newsItem.imageUrl}
        alt={newsItem.title}
        width={400}
        height={200}
        className='rounded-2xl object-cover w-full'
      />
      <div className='flex flex-col w-full h-full'>
        <div className='flex w-full gap-2 items-center'>
          <Avatar>
            <AvatarImage src='' />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <p className='text-sm text-gray-500'>
            {newsItem.author} | {newsItem.date}
          </p>
        </div>
        <p className='text-gray-700 mt-2 line-clamp-3'>
          {newsItem.content}
        </p>
      </div>
    </Card>
  );
};
