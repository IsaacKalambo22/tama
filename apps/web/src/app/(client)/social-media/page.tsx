import Posts from '@/modules/client/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Posts - TAMA Farmers Trust',
  description:
    'Stay updated with the latest news, insights, and updates from TAMA Farmers Trust.',
};

const PostsPage = () => {
  return <Posts />;
};

export default PostsPage;
