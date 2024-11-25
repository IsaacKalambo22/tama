import { Card } from '@/components/ui/card';
import { BlogProps } from '@/lib/api';
import {
  BASE_URL,
  formatDateTime,
} from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CustomBlogCardProps {
  blog: BlogProps;
  link: string;
}

const CustomBlogCard = ({
  blog,
  link,
}: CustomBlogCardProps) => {
  const {
    title,
    content,
    author,
    imageUrl,
    createdAt,
    updatedAt,
  } = blog;

  // Function to format the date
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // };

  return (
    <Link href={link}>
      <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg transition-shadow'>
        <Image
          src={`${BASE_URL}/uploads/${imageUrl}`}
          alt={title}
          width={400}
          height={250}
          className='rounded-2xl mb-4'
        />
        <h2 className='text-xl font-semibold mb-2'>
          {title}
        </h2>
        <p className='text-gray-700 mb-4'>
          {content}
        </p>
        <div className='flex justify-between items-center text-sm text-gray-500 mb-1'>
          <span>{author}</span>
          <div>
            <span>
              Created: {formatDateTime(createdAt)}
            </span>
            {updatedAt && (
              <span className='ml-2 text-gray-400'>
                Updated:{' '}
                {formatDateTime(updatedAt)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CustomBlogCard;
