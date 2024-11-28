import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { NewsProps } from '@/lib/api';
import {
  BASE_URL,
  formatDateTime,
} from '@/lib/utils';
import Image from 'next/image';
interface Props {
  newsItem: NewsProps;
}
const NewsCard = ({ newsItem }: Props) => {
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

export default NewsCard;
