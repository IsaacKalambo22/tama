import HeaderText from '@/modules/common/header-text';
import BlogCard from './blog-card';

const Blogs = () => {
  return (
    <div className='flex flex-col items-center gap-16 mb-16'>
      <HeaderText
        title='Our Blog'
        subtitle='Stay Updated with the Latest News and Insights'
      />
      <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Example Blog Cards */}
        <BlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='Sustainable Farming Practices'
          description='Learn about the best sustainable farming practices to enhance productivity and protect the environment...'
          author='John Doe'
          date='Oct 15, 2024'
          link='/blog/sustainable-farming-practices'
        />
        <BlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <BlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <BlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <BlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <BlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
      </div>
    </div>
  );
};

export default Blogs;
