import { Card } from '@/components/ui/card';
import {
  fetchBlogs,
  fetchCouncilList,
  fetchFormsAndDocuments,
  fetchNews,
  fetchReportsAndPublications,
  fetchShops,
} from '@/lib/api';
import { formatCount } from '@/lib/utils';
import AddNewHeader from '@/modules/common/add-new-header';
import {
  FaBook,
  FaClipboard,
  FaFileAlt,
  FaListAlt,
  FaNewspaper,
  FaRegCommentDots,
  FaStore,
  FaUsers,
} from 'react-icons/fa';

interface AdminStats {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const stats: AdminStats[] = [
  {
    title: 'Shops',
    count: 23, // Mocked value will be replaced by fetched data
    icon: (
      <FaStore
        size={30}
        className='text-blue-500'
      />
    ),
  },
  {
    title: 'Forms',
    count: 12, // Mocked value will be replaced by fetched data
    icon: (
      <FaClipboard
        size={30}
        className='text-green-500'
      />
    ),
  },
  {
    title: 'Blogs',
    count: 7, // Mocked value will be replaced by fetched data
    icon: (
      <FaRegCommentDots
        size={30}
        className='text-orange-500'
      />
    ),
  },
  {
    title: 'News',
    count: 15, // Mocked value will be replaced by fetched data
    icon: (
      <FaNewspaper
        size={30}
        className='text-red-500'
      />
    ),
  },
  {
    title: 'Users',
    count: 1024, // Mocked value will be replaced by fetched data
    icon: (
      <FaUsers
        size={30}
        className='text-purple-500'
      />
    ),
  },
  {
    title: 'Reports',
    count: 30, // Mocked value will be replaced by fetched data
    icon: (
      <FaFileAlt
        size={30}
        className='text-teal-500'
      />
    ),
  },
  {
    title: 'Publications',
    count: 8, // Mocked value will be replaced by fetched data
    icon: (
      <FaBook
        size={30}
        className='text-yellow-500'
      />
    ),
  },
  {
    title: 'Council Lists',
    count: 5, // Mocked value will be replaced by fetched data
    icon: (
      <FaListAlt
        size={30}
        className='text-indigo-500'
      />
    ),
  },
];

export default async function Dashboard() {
  // Fetch the data from the APIs
  const blogs = await fetchBlogs();
  const shops = await fetchShops();
  const reports =
    await fetchReportsAndPublications();
  const forms = await fetchFormsAndDocuments();
  const councilList = await fetchCouncilList();
  const news = await fetchNews();

  // Update the stats with fetched data or fallback to the mocked value
  const updatedStats = stats.map((stat) => {
    switch (stat.title) {
      case 'Shops':
        stat.count = shops?.length || stat.count;
        break;
      case 'Forms':
        stat.count = forms?.length || stat.count;
        break;
      case 'Blogs':
        stat.count = blogs?.length || stat.count;
        break;
      case 'News':
        stat.count = news?.length || stat.count;
        break;
      case 'Users':
        stat.count = 1024; // Replace with actual user data fetching logic if needed
        break;
      case 'Reports':
        stat.count =
          reports?.length || stat.count;
        break;
      case 'Publications':
        stat.count =
          reports?.length || stat.count;
        break;
      case 'Council Lists':
        stat.count =
          councilList?.length || stat.count;
        break;
      default:
        break;
    }
    return stat;
  });

  return (
    <section className='flex flex-col'>
      <AddNewHeader name='Dashboard' />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {updatedStats.map((stat, index) => (
          <Card
            key={index}
            className='shadow-none rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 flex items-center justify-between'
          >
            <div className='flex items-center space-x-4'>
              <div className='p-4 bg-blue-50 rounded-lg'>
                {stat.icon}
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {stat.title}
                </h3>
                <p className='text-2xl font-bold text-gray-600'>
                  {formatCount(stat.count)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
