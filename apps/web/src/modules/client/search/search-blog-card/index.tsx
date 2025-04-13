import { Card } from '@/components/ui/card';
import { BlogProps } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  blog: BlogProps;
}

const SearchBlogCard = ({
  blog,
}: BlogCardProps) => {
  const {
    title,
    content,
    author,
    imageUrl,
    createdAt,
    updatedAt,
  } = blog;
  return (
    <Link href={`/blogs/${blog.id}`}>
      <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg transition-shadow'>
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={250}
          unoptimized
          className='rounded-2xl w-full mb-4 h-[12rem]'
        />
        <h2 className='text-xl font-semibold mb-2 line-clamp-1'>
          {title}
        </h2>
        <p className='text-gray-700 mb-4 line-clamp-3'>
          {content}
        </p>
        <div className='flex justify-between items-center text-sm text-gray-500 mb-1'>
          <span>{author}</span>
          <div>
            <span>
              {updatedAt
                ? formatDateTime(updatedAt)
                : formatDateTime(createdAt)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SearchBlogCard;
