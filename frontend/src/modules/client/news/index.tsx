// app/news/page.tsx

'use client';

import { Button } from '@/components/ui/button';
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
    // Placeholder for actual API data fetch
    return [
      {
        id: 1,
        title: 'New Initiatives Launched',
        date: '2024-11-01',
        content:
          'TAMA has introduced new initiatives to support farmers...',
        imageUrl: '/assets/images/news/news1.jpg',
      },
      {
        id: 2,
        title: 'Annual Farmers Conference',
        date: '2024-10-20',
        content:
          'Join us for the upcoming annual conference to discuss...',
        imageUrl: '/assets/images/news/news2.jpg',
      },
    ];
  };

  if (loading) return <CustomLoader />;

  if (error)
    return (
      <CustomError message='Failed to load news.' />
    );

  return (
    <div className='w-full p-8 space-y-6'>
      <HeaderText
        title='TAMA News'
        subtitle='Stay Informed with the Latest Updates and Announcements'
      />
      <div className='space-y-6'>
        {news.map((item) => (
          <NewsCard
            key={item.id}
            newsItem={item}
          />
        ))}
      </div>
    </div>
  );
}

interface NewsCardProps {
  newsItem: NewsItem;
}

const NewsCard = ({
  newsItem,
}: NewsCardProps) => {
  return (
    <Card className='p-6 space-y-4 rounded-lg shadow-md transition-transform transform hover:scale-105'>
      <Image
        src={newsItem.imageUrl}
        alt={newsItem.title}
        width={600}
        height={300}
        className='rounded-lg object-cover'
      />
      <h3 className='text-2xl font-bold text-green-600'>
        {newsItem.title}
      </h3>
      <p className='text-sm text-gray-500'>
        {newsItem.date}
      </p>
      <p className='text-gray-700'>
        {newsItem.content}
      </p>
      <Button className='mt-4' variant='link'>
        Read More
      </Button>
    </Card>
  );
};
