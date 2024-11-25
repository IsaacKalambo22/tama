import AddNewHeader from '@/modules/common/add-new-header';
import CustomBlogCard from './custom-blog-card';

const AdminBlogs = () => {
  return (
    <div className='flex flex-col items-center gap-2 mb-16'>
      <AddNewHeader
        name='Blogs'
        buttonName='New Blog'
      />
      <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {/* Example Blog Cards */}
        <CustomBlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='Sustainable Farming Practices'
          description='Learn about the best sustainable farming practices to enhance productivity and protect the environment...'
          author='John Doe'
          date='Oct 15, 2024'
          link='/blog/sustainable-farming-practices'
        />
        <CustomBlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <CustomBlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <CustomBlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <CustomBlogCard
          imageUrl='/assets/images/shop1.jpg'
          title='How Technology is Changing Agriculture'
          description='Explore the latest technological advancements that are transforming the agricultural industry...'
          author='Jane Smith'
          date='Nov 01, 2024'
          link='/blog/technology-in-agriculture'
        />
        <CustomBlogCard
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

export default AdminBlogs;
