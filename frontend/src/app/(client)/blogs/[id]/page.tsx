import CustomBlogPage from '@/modules/common/custom-blog-page';

interface BlogPageProps {
  params: {
    id: string; // The product ID will be passed as a string in the params
  };
}
const BlogPage = ({ params }: BlogPageProps) => {
  console.log({ params });
  const id = params.id; //

  return <CustomBlogPage id={id} />;
};

export default BlogPage;
