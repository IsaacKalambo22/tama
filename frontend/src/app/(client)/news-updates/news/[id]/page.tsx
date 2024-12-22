import CustomNewsPage from '@/modules/common/custom-news-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Details - TAMA Farmers Trust',
  description:
    'Read the latest news from TAMA Farmers Trust.',
};

interface NewsPageProps {
  params: {
    id: string; // The news ID will be passed as a string in the params
  };
}

const NewsDetailsPage = ({
  params,
}: NewsPageProps) => {
  const id = params.id; // Extract the news ID from the params

  return <CustomNewsPage id={id} />;
};

export default NewsDetailsPage;
