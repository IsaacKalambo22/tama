import { fetchCouncilList } from '@/lib/api';
import { CustomDataTable } from '@/modules/common/custom-data-table';
import { councilListDataColumns } from '../council-list-data-columns';

const CouncilListDataTable = async () => {
  let councilLists = [];
  try {
    councilLists = await fetchCouncilList(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch councilLists:',
      error
    );
    return (
      <div>
        <p className='text-red-500'>
          Failed to load shops and publications.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <CustomDataTable
        data={councilLists}
        columns={councilListDataColumns}
        filterPlaceholder='Filter council list...'
        filterColumn='demarcation'
      />
    </div>
  );
};

export default CouncilListDataTable;
