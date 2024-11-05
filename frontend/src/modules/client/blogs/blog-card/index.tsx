import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  date: string;
  link: string;
}

const BlogCard = ({
  imageUrl,
  title,
  description,
  author,
  date,
  link,
}: BlogCardProps) => (
  <Link href={link}>
    <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg transition-shadow'>
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={250}
        className='rounded-2xl mb-4'
      />
      <h2 className='text-xl font-semibold mb-2'>
        {title}
      </h2>
      <p className='text-gray-700 mb-4'>
        {description}
      </p>
      <div className='flex justify-between items-center text-sm text-gray-500 mb-1'>
        <span>{author}</span>
        <span>{date}</span>
      </div>
    </Card>
  </Link>
);

export default BlogCard;
