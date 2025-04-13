import { fetchBlogs } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
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
      <div>
        <AddNewHeader
          name='Blog List'
          buttonName='New Blog'
        />
        <p className='text-red-500'>
          Failed to load blogs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Blog List'
        buttonName='New Blog'
      />
      {blogs.length > 0 ? (
        <BlogList blogs={blogs} />
      ) : (
        <p className='text-gray-500 mt-4'>
          No blogs available. Create a new blog to
          get started!
        </p>
      )}
    </div>
  );
};

export default Blog;
