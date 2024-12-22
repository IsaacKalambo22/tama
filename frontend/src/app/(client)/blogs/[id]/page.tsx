import CustomBlogPage from '@/modules/common/custom-blog-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Details - TAMA Farmers Trust',
  description:
    'Read the latest blog posts from TAMA Farmers Trust.',
};

interface BlogPageProps {
  params: {
    id: string; // The blog ID will be passed as a string in the params
  };
}

const BlogDetailsPage = ({
  params,
}: BlogPageProps) => {
  const id = params.id; // Extract the blog ID from the params

  return <CustomBlogPage id={id} />;
};

export default BlogDetailsPage;
