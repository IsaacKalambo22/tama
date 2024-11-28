import { fetchBlogs } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import BlogList from './blog-list';

const Blog = async () => {
  let blogs = [];
  try {
    blogs = await fetchBlogs(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch blogs:',
      error
    );
    return (
      <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-16 mb-16'>
        <HeaderText
          title='Our Blogs'
          subtitle='Stay Updated with the Latest News and Insights'
        />

        <p className='text-red-500'>
          Failed to load blogs and documents.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-8 mb-16'>
      <HeaderText
        title='Our Blogs'
        subtitle='Stay Updated with the Latest News and Insights'
      />
      <BlogList blogs={blogs} />
    </div>
  );
};

export default Blog;
