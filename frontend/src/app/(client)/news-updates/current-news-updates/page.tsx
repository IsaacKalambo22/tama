import News from '@/modules/client/news';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News - TAMA Farmers Trust',
  description:
    'Stay updated with the latest news and developments from TAMA Farmers Trust.',
};

const NewsPage = () => {
  return <News />;
};

export default NewsPage;
