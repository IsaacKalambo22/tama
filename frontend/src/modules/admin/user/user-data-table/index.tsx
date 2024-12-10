import { fetchUsers } from '@/lib/api';
import AddNewHeader from '@/modules/common/add-new-header';
import { CustomDataTable } from '@/modules/common/custom-data-table';
import { userColumns } from '../user-data-columns';

const UserDataTable = async () => {
  let councilLists = [];
  try {
    councilLists = await fetchUsers(); // Fetch the data directly
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
    <div className='flex flex-col w-full'>
      <AddNewHeader
        name='Users List'
        buttonName='Add User'
      />
      <CustomDataTable
        data={councilLists}
        columns={userColumns}
        filterPlaceholder='Filter users...'
        filterColumn='name'
      />
    </div>
  );
};

export default UserDataTable;
