import { fetchBlogs } from '@/lib/api';
import CustomBlogCard from '@/modules/admin/custom-blog/custom-blog-card';
import HeaderText from '@/modules/common/header-text';

const Blogs = async () => {
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
      <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {blogs.map((blog) => (
          <CustomBlogCard
            key={blog.id}
            blog={blog}
            link={`/blogs/${blog.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
