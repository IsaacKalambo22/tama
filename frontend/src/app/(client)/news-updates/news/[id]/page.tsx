import CustomNewsPage from '@/modules/common/custom-news-page';

interface NewsPageProps {
  params: {
    id: string; // The product ID will be passed as a string in the params
  };
}
const NewsPage = ({ params }: NewsPageProps) => {
  console.log({ params });
  const id = params.id; //

  return <CustomNewsPage id={id} />;
};

export default NewsPage;
