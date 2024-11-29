import { fetchBlogs } from '@/lib/api';
import AddNewHeader from '@/modules/common/add-new-header';
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
      <BlogList blogs={blogs} />
    </div>
  );
};

export default Blog;
