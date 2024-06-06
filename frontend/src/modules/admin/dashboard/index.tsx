import { Card } from '@/components/ui/card';
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
    count: 23, // Example number, replace with actual dynamic count
    icon: (
      <FaStore
        size={30}
        className='text-blue-500'
      />
    ),
  },
  {
    title: 'Forms',
    count: 12, // Example number, replace with actual dynamic count
    icon: (
      <FaClipboard
        size={30}
        className='text-green-500'
      />
    ),
  },
  {
    title: 'Blogs',
    count: 7, // Example number, replace with actual dynamic count
    icon: (
      <FaRegCommentDots
        size={30}
        className='text-orange-500'
      />
    ),
  },
  {
    title: 'News',
    count: 15, // Example number, replace with actual dynamic count
    icon: (
      <FaNewspaper
        size={30}
        className='text-red-500'
      />
    ),
  },
  {
    title: 'Users',
    count: 1024, // Example number, replace with actual dynamic count
    icon: (
      <FaUsers
        size={30}
        className='text-purple-500'
      />
    ),
  },
  {
    title: 'Reports',
    count: 30, // Example number, replace with actual dynamic count
    icon: (
      <FaFileAlt
        size={30}
        className='text-teal-500'
      />
    ),
  },
  {
    title: 'Publications',
    count: 8, // Example number, replace with actual dynamic count
    icon: (
      <FaBook
        size={30}
        className='text-yellow-500'
      />
    ),
  },
  {
    title: 'Council Lists',
    count: 5, // Example number, replace with actual dynamic count
    icon: (
      <FaListAlt
        size={30}
        className='text-indigo-500'
      />
    ),
  },
];

export default function Dashboard() {
  return (
    <section className=' flex flex-col'>
      <AddNewHeader name='Dashboard' />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className='shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 flex items-center justify-between'
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
                  {stat.count}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
