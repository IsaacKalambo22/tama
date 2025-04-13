import { fetchStat } from '@/lib/api';
import StatList from './stat-list';
import AddNewHeader from '../add-new-header';


const Stat = async () => {
  let stat = [];
  try {
    stat = await fetchStat(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch stats:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Stat List'
          buttonName='New Stat'
        />
        <p className='text-red-500'>
          Failed to load status.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Stat List'
        buttonName='New Stat'
      />
      {stat?.length > 0 ? (
        <StatList stats={stat} />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No status available. Create a new status to
          get started!
        </p>
      )}
    </div>
  );
};

export default Stat;
