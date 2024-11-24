import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { fetchNews, NewsProps } from '@/lib/api';
import {
  BASE_URL,
  formatDateTime,
} from '@/lib/utils';
import HeaderText from '@/modules/common/header-text';
import Image from 'next/image';

const News = async () => {
  let news = [];
  try {
    news = await fetchNews(); // Fetch the data directly
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return (
      <div>
        <HeaderText
          title='TAMA News'
          subtitle='Stay Informed with the Latest Updates and Announcements'
        />
        <p className='text-red-500'>
          Failed to load news and publications.
        </p>
      </div>
    );
  }

  // Separate the most recent news item
  const [mostRecent, ...otherNews] = news;
  const authorInitial = mostRecent.author
    .charAt(0)
    .toUpperCase(); // Get the first letter of the author's name

  return (
    <div className='w-full space-y-6'>
      <HeaderText
        title='TAMA News'
        subtitle='Stay Informed with the Latest Updates and Announcements'
      />
      <div className='space-y-10'>
        {/* Most Recent Story */}
        {mostRecent && (
          <Card className='shadow-none rounded-lg border-none flex flex-col sm:flex-row items-center h-auto sm:h-[20rem] gap-10'>
            <Image
              src={`${BASE_URL}/uploads/${mostRecent.imageUrl}`}
              alt={mostRecent.title}
              width={400}
              height={350}
              className='rounded-2xl object-cover h-full w-full sm:w-1/2'
            />
            <div className='flex py-8 pr-10 flex-col justify-between w-full md:w-1/2 h-full space-y-4'>
              <div className='flex gap-2 items-center'>
                <Avatar>
                  <AvatarImage src='' />
                  <AvatarFallback>
                    {authorInitial}
                  </AvatarFallback>
                </Avatar>
                <p className='text-sm text-gray-500'>
                  {mostRecent.author} |{' '}
                  {formatDateTime(
                    mostRecent.createdAt
                  )}
                </p>
              </div>
              <h3 className='md:text-3xl text-2xl font-bold'>
                {mostRecent.title}
              </h3>
              <p className='text-gray-700 mt-2 line-clamp-4'>
                {mostRecent.content}
              </p>
              <p className='text-gray-700 mt-2'>
                {mostRecent.readingTime} min read
              </p>
            </div>
          </Card>
        )}

        {/* Other News Stories */}
        <div className='grid mt-5 sm:mt-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
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
};

interface SmallNewsProps {
  newsItem: NewsProps;
}
const SmallNewsCard = ({
  newsItem,
}: SmallNewsProps) => {
  const {
    author,
    imageUrl,
    title,
    content,
    createdAt,
  } = newsItem;
  const authorInitial = author
    .charAt(0)
    .toUpperCase(); // Get the first letter of the author's name

  return (
    <Card className='p-6 shadow-none cursor-pointer rounded-3xl space-y-4 transition-transform transform hover:scale-105'>
      <Image
        src={`${BASE_URL}/uploads/${imageUrl}`}
        alt={title}
        width={200}
        height={150}
        className='rounded-2xl w-full mb-4 h-[12rem]'
      />
      <div className='flex flex-col w-full h-full'>
        <div className='flex w-full gap-2 items-center'>
          <Avatar>
            <AvatarImage src='' />
            <AvatarFallback>
              {authorInitial}
            </AvatarFallback>
          </Avatar>
          <p className='text-sm text-gray-500'>
            {author} | {formatDateTime(createdAt)}
          </p>
        </div>
        <h2 className='text-[1rem] font-semibold mt-2 line-clamp-1'>
          {title}
        </h2>
        <p className='text-gray-700 mt-2 line-clamp-3'>
          {content}
        </p>
      </div>
    </Card>
  );
};

export default News;
