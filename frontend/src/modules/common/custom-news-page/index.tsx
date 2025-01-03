import {
  NewsProps,
  fetchNewsById,
} from '@/lib/api';
import {
  formatContent,
  formatDateTime,
} from '@/lib/utils';
import Image from 'next/image';

export default async function CustomNewsPage({
  id,
}: {
  id: string;
}) {
  const news: NewsProps | null =
    await fetchNewsById(id); // Fetch news by ID

  if (!news) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-semibold text-gray-700'>
          News Not Found
        </h1>
        <p className='text-gray-500'>
          We couldn&apos;t find the news you were
          looking for.
        </p>
      </div>
    );
  }

  const formattedContent = formatContent(
    news.content
  );

  return (
    <article className='max-w-4xl mx-auto px-6 py-12'>
      {/* News Header */}
      <header className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>
          {news.title}
        </h1>
        <div className='text-sm text-gray-500 mt-2'>
          <span>By {news.author}</span>
          <span className='ml-4'>
            {formatDateTime(news.createdAt)}
          </span>
        </div>
      </header>

      {/* News Image */}
      <div className='w-full mb-6'>
        <Image
          src={news.imageUrl}
          alt={news.title}
          width={900}
          height={600}
          unoptimized
          className='rounded-2xl object-fill h-auto max-h-[20rem] sm:max-h-[30rem]' // Added responsive max-height for small devices
        />
      </div>

      {/* Blog Content */}
      <div className='prose prose-lg max-w-none text-gray-700 space-y-8'>
        {formattedContent.map(
          (paragraph, index) => (
            <p key={index}>{paragraph}</p>
          )
        )}
      </div>

      {/* News Footer */}
      <footer className='mt-12 pt-6 border-t'>
        <p className='text-sm text-gray-500'>
          Last updated:{' '}
          {formatDateTime(news.updatedAt)}
        </p>
      </footer>
    </article>
  );
}
