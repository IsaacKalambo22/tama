import BlogDetail from '@/modules/client/blog/blog-detail';
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

const BlogDetailsPage = async ({
  params,
}: BlogPageProps) => {
  const id = (await params).id; // Extract the blog ID from the params

  return <BlogDetail id={id} />;
};

export default BlogDetailsPage;
