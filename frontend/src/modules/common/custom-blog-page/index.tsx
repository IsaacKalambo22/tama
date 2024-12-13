import {
  BlogProps,
  fetchBlogById,
} from '@/lib/api';
import {
  BASE_URL,
  formatContent,
  formatDateTime,
} from '@/lib/utils';
import Image from 'next/image';

export default async function CustomBlogPage({
  id,
}: {
  id: string;
}) {
  const blog: BlogProps | null =
    await fetchBlogById(id); // Fetch blog by ID

  if (!blog) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-semibold text-gray-700'>
          Blog Not Found
        </h1>
        <p className='text-gray-500'>
          We couldn&apos;t find the blog you were
          looking for.
        </p>
      </div>
    );
  }

  // Function to format the blog content

  const formattedContent = formatContent(
    blog.content
  );

  return (
    <article className='max-w-4xl mx-auto px-6 py-12'>
      {/* Blog Header */}
      <header className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>
          {blog.title}
        </h1>
        <div className='text-sm text-gray-500 mt-2'>
          <span>By {blog.author}</span>
          <span className='ml-4'>
            {formatDateTime(blog.createdAt)}
          </span>
        </div>
      </header>

      {/* Blog Image */}
      <div className='relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8'>
        <Image
          src={`${BASE_URL}/uploads/${blog.imageUrl}`}
          alt={blog.title}
          layout='fill'
          objectFit='cover'
          className='rounded-2xl'
        />
      </div>

      {/* Blog Content */}
      <div className='prose prose-lg text-[0.9rem] max-w-none text-gray-700 space-y-8'>
        {formattedContent.map(
          (paragraph, index) => (
            <p key={index}>{paragraph}</p>
          )
        )}
      </div>

      {/* Blog Footer */}
      <footer className='mt-12 pt-6 border-t'>
        <p className='text-sm text-gray-500'>
          Last updated:{' '}
          {formatDateTime(blog.updatedAt)}
        </p>
      </footer>
    </article>
  );
}
