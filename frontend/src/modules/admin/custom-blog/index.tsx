import { fetchBlogs } from '@/lib/api';
import AddNewHeader from '@/modules/common/add-new-header';
import CustomBlogCard from './custom-blog-card';

const CustomBlog = async () => {
  let blogs = [];
  try {
    blogs = await fetchBlogs(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch blogs:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Blogs'
          buttonName='New Blog'
        />
        <p className='text-red-500'>
          Failed to load blogs and publications.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Blogs'
        buttonName='New Blog'
      />
      <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {blogs.map((blog) => (
          <CustomBlogCard
            key={blog.id}
            blog={blog}
            link={`/admin/blogs/${blog.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomBlog;
