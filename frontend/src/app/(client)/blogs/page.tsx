import Blog from '@/modules/client/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs - TAMA Farmers Trust',
  description:
    'Discover the latest blogs and insights from TAMA Farmers Trust.',
};

const BlogsPage = () => {
  return <Blog />;
};

export default BlogsPage;
