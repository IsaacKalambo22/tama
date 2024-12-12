import { BlogProps } from '@/lib/api';
import BlogCard from '../blog-card';
interface Props {
  blogs: BlogProps[];
}
const BlogList = ({ blogs }: Props) => {
  return (
    <div className='grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
